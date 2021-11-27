export function schemaValidator(obj) {
    const className = obj.constructor.name;
    const schemaObj = obj.constructor.schema;
    const data = obj.data;

    for (const [prop, schema] of Object.entries(schemaObj)) {
        if (schema.required) {
            if (!(prop in data)) {
                throw new Error(`${className}.${prop} is required.`);
            }
        } else {
            if (!(prop in data)) {
                continue;
            }
        }
        for (const [key, value] of Object.entries(schema)) {
            const validate = getValidator(key, value);
            if (!validate(data[prop])) {
                throw new Error(`${className}.${prop} is not valid: [${key}]`);
            }
        }
    }
}

function getValidator(key, value) {
    switch (key) {
        case 'required':
            return () => true;
        case 'type':
            return getTypeValidator(value);
        case 'minlen':
            return minlen(value);
        case 'maxlen':
            return maxlen(value);
        case 'min':
            return min(value);
        case 'max':
            return max(value);
        default:
            throw new Error(`Validator for ${key} is not supported.`);
    }
}

function getTypeValidator(type) {
    switch (type) {
        case String:
            return isString;
        case Number:
            return isNumber;
        case Array:
            return isArray;
        case Date:
            return isDate;
        case Boolean:
            return isBoolean;
        case Object:
            return isObject;
        default:
            throw new Error(`Validator ${type} is not supported.`);
    }
}

/** Type Validators */

function isNumber(num) {
    return Number.isFinite(num);
}

function isString(s) {
    return typeof s === 'string';
}

function isArray(obj) {
    return Array.isArray(obj);
}

function isObject(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

function isDate(obj) {
    return obj instanceof Date;
}

function isBoolean(obj) {
    return typeof obj === 'boolean';
}

/** String validators */

function minlen(num) {
    return function minlen(string) {
        return string.length >= num;
    };
}

function maxlen(num) {
    return function maxlen(string) {
        return string.length <= num;
    };
}

/** Number validators */

function min(num) {
    return function min(n) {
        return n >= num;
    };
}

function max(num) {
    return function min(n) {
        return n <= num;
    };
}
