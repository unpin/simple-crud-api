import uuid from '../../../utils/uuid/uuid.js';

export class UUID {
    constructor() {
        this.uuid = uuid.generateUUID();
    }
    static isValid(_id) {
        return uuid.isValid(_id);
    }
}

const defaultOptions = {
    autoGenerateID: true,
};

export default class DataSource {
    static INSTANCE = null;

    constructor(options) {
        this.database = new Map();
        this.options = Object.assign({}, defaultOptions, options);
    }

    getCollection(collection) {
        this.ensureCollection(collection);
        return this.database.get(collection);
    }

    ensureCollection(collection) {
        if (!this.database.has(collection)) {
            this.database.set(collection, []);
        }
    }

    addDocument(collection, doc) {
        this.ensureCollection(collection);
        const docs = this.getCollection(collection);
        if (this.options.autoGenerateID) {
            DataSource.generateDocumentID(doc);
        }
        docs.push(Object.assign({}, doc));
        return Promise.resolve(doc);
    }

    getDocument(collection, query) {
        const docs = this.getCollection(collection);

        if (!query) return [...this.getCollection(collection)];
        const doc = docs.find(DataSource.queryFilter(query));
        if (doc) {
            return Promise.resolve(Object.assign({}, doc));
        }

        return Promise.resolve(null);
    }

    getDocuments(collection, query) {
        const docs = this.getCollection(collection);
        if (!query) return [...docs];
        const filtered = docs.filter(DataSource.queryFilter(query));
        return Promise.resolve(filtered);
    }

    updateDocument(collection, query, update) {
        const docs = this.getCollection(collection);
        const document = docs.find(DataSource.queryFilter(query));
        if (document) {
            const updated = Object.assign(document, update);
            return Promise.resolve(updated);
        }
        return Promise.resolve(null);
    }

    deleteDocument(collection, query) {
        const docs = this.getCollection(collection);
        const docIndex = docs.findIndex(DataSource.queryFilter(query));
        if (docIndex != -1) {
            const found = docs[docIndex];
            docs.splice(docIndex, 1).pop();
            return Promise.resolve(Object.assign({}, found));
        }

        return Promise.resolve(null);
    }

    static generateDocumentID(doc) {
        if (!doc._id) {
            doc._id = uuid.generateUUID();
        }
    }

    static queryFilter = (query) => {
        return (doc) => {
            for (const [key, value] of Object.entries(query)) {
                if (doc[key] !== value) return false;
            }
            return true;
        };
    };

    static connect(options) {
        DataSource.INSTANCE = new DataSource(options);
        return Promise.resolve();
    }

    static getInstance() {
        return DataSource.INSTANCE;
    }
}
