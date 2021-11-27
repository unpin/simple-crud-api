import DataSource from '../lib/database/source/DataSource.js';

export default function connect() {
    DataSource.connect({ autoGenerateID: true })
        .then(() => {
            console.log('Connected to the database.');
        })
        .catch((error) => {
            console.error('Connection to the database failed.', error.message);
        });
}
