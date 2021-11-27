import Model from '../lib/database/model/Model.js';

export default class Person extends Model {
    constructor() {}

    static schema = {
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
}
