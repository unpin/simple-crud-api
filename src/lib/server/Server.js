import http from 'http';
import HttpError from './error/HttpError.js';
import toCamelCase from './utils/strings/toCamelCase.js';
import { Router } from './Router.js';
import { HTTP_HEADERS, STATUS_CODES } from './constants.js';

const defaultOptions = {
    timeout: 5000,
};

export default class Server extends Router {
    constructor(options = defaultOptions) {
        super();
        this.options = Object.assign({}, options);
        this.server = http.createServer(this.serverListener.bind(this));
        this.server.on('error', ({ code, errno, syscall, address, port }) => {
            switch (code) {
                case 'EADDRINUSE':
                    console.error(
                        `${syscall}. Port ${address}:${port} is already in use.`
                    );
                    break;
            }
            process.exitCode = errno;
        });
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }

    async runHandlers(req, res) {
        const handlers = this.getRouteHandlers(req);
        const beforeHandlers = handlers.slice(0, handlers.length - 1);

        for (const handler of beforeHandlers) {
            await withTimeout(async () => {
                await new Promise(async (resolve, reject) => {
                    try {
                        await handler(req, res, resolve);
                    } catch (error) {
                        reject(error);
                    }
                });
            }, this.options.timeout);
        }

        const handler = handlers[handlers.length - 1];

        if (handler) {
            await handler(req, res);
        } else {
            throw new HttpError(404);
        }
    }

    ensureMethodSupported(method) {
        if (!this.routes[method]) {
            throw new HttpError(405);
        }
    }

    async runMiddleware(req, res) {
        for (const middleware of this.middleware) {
            await withTimeout(async () => {
                await new Promise(async (resolve, reject) => {
                    try {
                        await middleware(req, res, resolve);
                    } catch (error) {
                        reject(error);
                    }
                });
            }, this.options.timeout);
        }
    }

    async serverListener(req, res) {
        res.status = function (statusCode) {
            res.statusCode = statusCode;
            return this;
        };

        res.json = function (data) {
            res.setHeader(HTTP_HEADERS.CONTENT_TYPE, 'application/json');
            res.end(JSON.stringify(data));
        };

        try {
            this.ensureMethodSupported(req.method);

            req.header = this.parseHeaders(req.headers);
            req.body = [];
            req.params = {};

            await this.readRequestBody(req);
            await this.runMiddleware(req, res);
            await this.runHandlers(req, res);
        } catch (error) {
            console.error(error.message);
            if (!res.writableEnded) {
                error.statusCode = error.statusCode || 500;
                if (error.statusCode >= 500) {
                    error.message = STATUS_CODES[error.statusCode];
                }
                error.message = error.message || STATUS_CODES[error.statusCode];
                res.status(error.statusCode).end(error.message);
            }
        }
    }

    async readRequestBody(req) {
        await new Promise((resolve, reject) => {
            const data = [];
            req.on('data', (chunk) => data.push(chunk));
            req.on('end', async () => {
                try {
                    req.body = Buffer.concat(data).toString();
                } catch (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }

    parseHeaders(headers) {
        return Object.entries(headers).reduce(
            (obj, [header, value]) =>
                Object.assign(obj, { [toCamelCase(header)]: value }),
            {}
        );
    }
}

Server.json = async (req, res, next) => {
    if (req.header.contentType === 'application/json') {
        try {
            req.body = JSON.parse(req.body);
        } catch {
            throw new HttpError(
                400,
                'Could not parse request data, invalid JSON.'
            );
        }
    }
    next();
};

function withTimeout(callback, ms) {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            reject(new HttpError(504, `Request handler timed out.`));
        }, ms);
        try {
            await callback();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export { Router };
