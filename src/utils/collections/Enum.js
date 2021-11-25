export default class Enum {
    constructor(...keys) {
        keys.forEach((key) => {
            this[key] = key;
        });
        Object.freeze(this);
    }

    *[Symbol.iterator]() {
        for (const key of Object.keys(this)) {
            yield key;
        }
    }
}
