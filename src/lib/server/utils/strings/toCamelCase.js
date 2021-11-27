import capitalize from './capitalize.js';

export default function toCamelCase(string) {
    return string.split('-').reduce((prev, curr, index) => {
        if (index) return prev + capitalize(curr);
        return prev + curr;
    }, '');
}
