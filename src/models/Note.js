import Model from '../lib/database/model/Model.js';
import UUID from '../utils/uuid/UUID.js';

export default class Note extends Model {
    constructor() {}

    static findByPersonID(personID) {
        return this.find({ personID });
    }

    static schema = {
        personID: {
            type: UUID,
            required: true,
        },
        text: {
            type: String,
            required: true,
            minlen: 1,
        },
        date: {
            type: Date,
            required: true,
        },
    };
}
