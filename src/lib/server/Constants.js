export { STATUS_CODES } from 'http';
import Enum from '../../utils/collections/Enum.js';

export const HTTP_METHODS = new Enum('GET', 'POST', 'PUT', 'DELETE');
export const HTTP_HEADERS = new Enum({
    CONTENT_TYPE: 'Content-Type',
});
