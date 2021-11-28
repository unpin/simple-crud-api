import Model from '../lib/database/model/Model.js';
import UUID from '../utils/uuid/UUID.js';

export default class Person extends Model {
    constructor(data) {
        super();
        this.data = data;
    }

    async save() {
        this.data = await Person.createOne(this.data);
        return this.data;
    }

    static schema = {
        _id: {
            type: UUID,
        },
        name: {
            type: String,
            required: true,
            minlen: 1,
        },
        age: {
            type: Number,
            required: true,
            min: 6,
            max: 120,
        },
        hobbies: {
            type: Array,
            required: true,
        },
    };

    toJSON() {
        return Person.trimObject(this.data);
    }
}
