import crypto from 'crypto';

const UUIDv4_REGEX = /^([0-9a-fA-F]){8}(-[0-9a-fA-F]{4}){3}-([0-9a-fA-F]){12}$/;

class UUID {
    constructor() {}
    isValid(uuidString) {
        return UUIDv4_REGEX.test(uuidString);
    }
    generateUUID(options) {
        return crypto.randomUUID(options);
    }
}

export default new UUID();
