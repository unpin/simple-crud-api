export default class Enum {
    constructor(...keys) {
        if (typeof keys[0] === 'string') {
            this.addKeys(keys);
        } else if (typeof keys[0] === 'object') {
            this.addObjectKeys(keys[0]);
        }
        Object.freeze(this);
    }

    addKeys(keys) {
        keys.forEach((key) => this.addKey(key));
    }

    addObjectKeys(obj) {
        Object.entries(obj).forEach(([key, value]) => this.addKey(key, value));
    }

    addKey(key, value) {
        value ? (this[key] = value) : (this[key] = key);
    }

    *[Symbol.iterator]() {
        for (const key of Object.keys(this)) {
            yield key;
        }
    }
}
