import { HTTP_METHODS } from './constants.js';
import HttpError from './error/HttpError.js';

const ROUTE_PATTERN = /^\/(\/*:*[a-zA-Z0-9-_]+)*\/*$/;

export class Router {
    constructor() {
        this.middleware = [];
        this.routes = {};
    }

    post(pathname, ...handlers) {
        this.addRoute(HTTP_METHODS.POST, pathname, handlers);
    }

    get(pathname, ...handlers) {
        this.addRoute(HTTP_METHODS.GET, pathname, handlers);
    }

    put(pathname, ...handlers) {
        this.addRoute(HTTP_METHODS.PUT, pathname, handlers);
    }

    delete(pathname, ...handlers) {
        this.addRoute(HTTP_METHODS.DELETE, pathname, handlers);
    }

    appendRouter(pathname, router) {
        for (const [method, root] of Object.entries(router.routes)) {
            this.addRoute(method, pathname, root.handlers);
            for (const child of root.children) {
                this.addRoute(
                    method,
                    pathname + '/' + child.token,
                    child.handlers
                );
                this.appendRouter(pathname);
            }
        }
    }

    appendNode(method, pathname, node) {
        this.addRoute(method, pathname + '/' + node.token, node.handlers);
        for (const child of node.children) {
            this.appendNode(method, pathname + '/' + node.token, child);
        }
    }

    addRoute(method, pathname, handlers) {
        this.ensurePathValid(pathname);
        const tokens = pathname.split('/').filter(Boolean);
        if (!this.routes[method]) {
            this.routes[method] = new PathNode('');
        }

        let currPath = this.routes[method];
        for (const token of tokens) {
            const child = currPath.findChild(token);
            if (child) {
                currPath = child;
            } else {
                const node = new PathNode(token);
                currPath.addChild(node);
                currPath = node;
            }
        }
        currPath.addHandlers(...handlers);
    }

    getRouteHandlers(req) {
        const tokens = req.url.split('/').filter(Boolean);
        let route = this.routes[req.method];

        for (const token of tokens) {
            const match = route.findChild(token) || route.findParamChild();
            if (!match) throw new HttpError(404);
            if (match.isParam()) {
                req.params[match.getTokenName()] = token;
            }
            route = match;
        }
        return route.handlers;
    }

    ensurePathValid(pathname) {
        if (!pathname.match(ROUTE_PATTERN)) {
            new Error(`Invalid URL pattern: ${pathname}`);
        }
    }

    use(pathname, router) {
        if (typeof pathname === 'function') {
            this.middleware.push(pathname);
        } else {
            this.ensurePathValid(pathname);
            const { routes } = router;
            for (const [method] of Object.entries(routes)) {
                this.appendNode(method, pathname, router.routes[method]);
            }
        }
    }
}

class PathNode {
    constructor(token) {
        this.token = token;
        this.children = [];
        this.handlers = [];
    }

    addChild(child) {
        this.children.push(child);
    }

    addHandlers(...handlers) {
        this.handlers.push(...handlers);
    }

    findChild(token) {
        return this.children.find((child) => child.token === token);
    }

    findParamChild() {
        return this.children.find((child) => child.isParam());
    }

    isParam() {
        return this.token.startsWith(':');
    }

    getTokenName() {
        return this.token.replace(':', '');
    }
}
