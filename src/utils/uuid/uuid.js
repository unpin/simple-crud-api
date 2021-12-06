import crypto from 'crypto';

const UUIDv4_REGEX = /^([0-9a-fA-F]){8}(-[0-9a-fA-F]{4}){3}-([0-9a-fA-F]){12}$/;

export default class UUID {
    constructor() {}
    static isValid(uuidString) {
        return UUIDv4_REGEX.test(uuidString);
    }
    static generateUUID(options) {
        return crypto.randomUUID(options);
    }
}
