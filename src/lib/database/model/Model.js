import DataSource from '../source/DataSource.js';
import { schemaValidator } from './SchemaValidator.js';

export default class Model {
    constructor() {}

    static createOne(data) {
        const className = this.name;
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
}
