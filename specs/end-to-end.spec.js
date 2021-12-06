import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import * as Validator from '../src/lib/database/model/SchemaValidator.js';
import UUID from '../src/utils/uuid/UUID.js';
import Model from '../src/lib/database/model/Model.js';

const server = app.server;

describe('End-to-end scenario #1', () => {
    const person = {
        name: 'John',
        age: 20,
        hobbies: ['books'],
    };

    it('should return 500 status code when internal error occurs', async () => {
        const schemaValidatorMock = jest.spyOn(Validator, 'schemaValidator');
        schemaValidatorMock.mockImplementation(() => {
            throw new Error('Some internal error is thrown.');
        });

        const response = await request(server).post('/person').send(person);
        expect(response.statusCode).toBe(500);

        schemaValidatorMock.mockReset();
        schemaValidatorMock.mockRestore();
        schemaValidatorMock.mockClear();
    });

    it('GET /person - should respond with 200 status code and an empty array', async () => {
        const response = await request(server).get('/person');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it('POST /person - should create and return created person with 201 status code', async () => {
        const response = await request(server).post('/person').send(person);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id', 'name', 'age', 'hobbies');
        person._id = response.body._id;
    });

    it('GET /person/:personID - should return created person with 200 status code', async () => {
        const response = await request(server).get('/person/' + person._id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', 'name', 'age', 'hobbies');
        expect(response.body._id).toBe(person._id);
    });

    it('PUT /person/:personID - should return updated person with 200 status code', async () => {
        const response = await request(server)
            .put('/person/' + person._id)
            .send({ name: 'Mathew', age: 18, hobbies: ['drawing'] });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', 'name', 'age', 'hobbies');
        expect(response.body.age).toBe(18);
    });

    it('DELETE /person/:personID - should return deleted person with 204 status code', async () => {
        const response = await request(server).delete('/person/' + person._id);
        expect(response.statusCode).toBe(204);
    });

    it('GET /person/:personID - should return 404 status code when person with the ID does not exist', async () => {
        const response = await request(server).get('/person/' + person._id);
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain('Person with this ID does not exist.');
    });
});

describe('End-to-end scenario #2', () => {
    it('GET /person - should respond with 200 status code and an empty array', async () => {
        const response = await request(server).get('/person');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it('GET /person/:personID - should return 404 status code when user does not exist', async () => {
        const response = await request(server).get(
            '/person/' + UUID.generateUUID()
        );
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain('Person with this ID does not exist.');
    });

    it('PUT /person/:personID - should return 404 status code when user does not exist', async () => {
        const response = await request(server)
            .put('/person/' + UUID.generateUUID())
            .send({ name: 'Mathew', age: 18, hobbies: ['drawing'] });
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain('Person with this ID does not exist.');
    });

    it('DELETE /person/:personID - should respond with 404 status code when user does not exist', async () => {
        const response = await request(server).delete(
            '/person/' + UUID.generateUUID()
        );
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain('Person with this ID does not exist.');
    });
});

describe('End-to-end scenario #3', () => {
    const personWithNoName = {
        age: 20,
        hobbies: ['books'],
    };

    let personID = null;

    it('POST /person - should return 400 when required fields are not provided', async () => {
        const response = await request(server).post('/person').send({});
        expect(response.statusCode).toBe(400);
    });

    it('POST /person - should create and return created person with 201 status code', async () => {
        const response = await request(server)
            .post('/person')
            .send(Object.assign({ name: 'Peter' }, personWithNoName));
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id', 'name', 'age', 'hobbies');
        personID = response.body._id;
    });

    it('PUT /person/:personID - should return 400 status code with a message when "name" is not provided', async () => {
        const response = await request(server)
            .put('/person/' + personID)
            .send(personWithNoName);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('Person.name is required.');
    });

    it('PUT /person/:personID - should return 400 status code when provided UUID is not valid', async () => {
        const response = await request(server)
            .put('/person/' + 'NOT-UUID')
            .send({ name: 'Mathew', age: 18, hobbies: ['drawing'] });
        expect(response.statusCode).toBe(400);
    });

    it('DELETE /person/:personID - should respond with 400 status code when provided UUID is not valid', async () => {
        const response = await request(server).delete('/person/' + 'NOT-UUID');
        expect(response.statusCode).toBe(400);
    });
});

describe('End-to-end scenario #4', () => {
    let person = null;

    it('GET /notes/:personID - should return 200 status code and an empty array', async () => {
        const response = await request(server).get(
            '/notes/' + UUID.generateUUID()
        );
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it('GET /notes/:personID - should return status 400 when invalid UUID provided', async () => {
        const response = await request(server).get('/notes/' + 'NOT-UUID');
        expect(response.statusCode).toBe(400);
    });

    it('POST /person - should create a new person', async () => {
        const response = await request(server)
            .post('/person')
            .send({
                name: 'Jared',
                age: 23,
                hobbies: ['coding', 'running'],
            });
        person = response.body;
        console.log({ personasdas: person });
    });

    it('POST /notes - should return 404 if person with the given ID does not exist', async () => {
        const response = await request(server).post('/notes').send({
            personID: UUID.generateUUID(),
            text: 'Hello there!',
        });
        expect(response.statusCode).toBe(404);
    });

    it('POST /notes - should return 400 if required fields are not provided', async () => {
        const response = await request(server).post('/notes').send({
            personID: person._id,
        });
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('Note.text is required.');
    });

    it('POST /notes - should return 400 if provided personID is not valid', async () => {
        const response = await request(server).post('/notes').send({
            personID: 'NOT-UUID',
            test: 'Hello there',
        });
        expect(response.statusCode).toBe(400);
    });

    it('POST /notes - should return 400 status code if invalid JSON provided', async () => {
        const response = await request(server)
            .post('/notes')
            .set('Content-Type', 'application/json')
            .send('NOT JSON');
        expect(response.statusCode).toBe(400);
    });

    it('POST /notes - should create a note for a given personID', async () => {
        const response = await request(server).post('/notes').send({
            personID: person._id,
            text: 'Hello there!',
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('text');
    });

    it('GET /notes/:personID - should return 200 status code and an array with one user note', async () => {
        const response = await request(server).get('/notes/' + person._id);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    it('POST /notes - should return 500 when internal error occurs', async () => {
        const schemaValidatorMock = jest.spyOn(Validator, 'schemaValidator');
        schemaValidatorMock.mockImplementation(() => {
            throw new Error('Some internal error is thrown.');
        });

        const response = await request(server).post('/notes').send({
            personID: person._id,
            text: 'Hello there!',
        });
        expect(response.statusCode).toBe(500);

        schemaValidatorMock.mockReset();
        schemaValidatorMock.mockRestore();
        schemaValidatorMock.mockClear();
    });

    it('GET /notes/:personID - should return 500 if internal error occurs', async () => {
        const findMock = jest.spyOn(Model, 'find');
        findMock.mockImplementation(() => {
            throw new Error('Some internal error is thrown.');
        });

        const response = await request(server).get('/notes/' + person._id);
        expect(response.statusCode).toBe(500);

        findMock.mockReset();
        findMock.mockRestore();
        findMock.mockClear();
    });

    it('PATCH /notes should return 405 status code', async () => {
        const response = await request(server).patch('/notes/' + person._id);
        expect(response.statusCode).toBe(405);
    });
});
