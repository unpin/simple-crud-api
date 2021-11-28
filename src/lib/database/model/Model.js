import DataSource from '../source/DataSource.js';
import { schemaValidator } from './SchemaValidator.js';

export default class Model {
    constructor(data) {
        this.data = data;
    }

    static createOne(data) {
        const className = this.name;
        data = this.trimObject(data);
        schemaValidator(this, data);
        return DataSource.getInstance().addDocument(className, data);
    }

    static findOne(query) {
        const className = this.name;
        return DataSource.getInstance().getDocument(className, query);
    }

    static findByID(_id) {
        return this.findOne({ _id });
    }

    static find(query) {
        const className = this.name;
        return DataSource.getInstance().getDocuments(className, query);
    }

    static updateOne(query, update, options = { new: true }) {
        const className = this.name;
        update = this.trimObject(update);
        schemaValidator(this, update);
        return DataSource.getInstance().updateDocument(
            className,
            query,
            update
        );
    }

    static deleteOne(query) {
        const className = this.name;
        return DataSource.getInstance().deleteDocument(className, query);
    }

    static deleteByID(_id) {
        return this.deleteOne({ _id });
    }

    static trimObject(data) {
        const schema = this.schema;
        const trimmed = {};
        for (const key of Object.keys(schema)) {
            if (data[key]) {
                trimmed[key] = data[key];
            }
        }
        return trimmed;
    }

    toJSON() {
        return this.constructor.trimObject.call(this.constructor, this.data);
    }
}
