import Person from '../models/Person.js';
import UUID from '../utils/uuid/UUID.js';

export async function create(req, res) {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (error) {
        res.status(400).end(error.message);
    }
}

export async function getAll(req, res) {
    try {
        const people = await Person.find();
        res.status(200).json(people);
    } catch (error) {
        console.error(error.message);
        res.status(500).end('Something went wrong.');
    }
}

export async function getByID(req, res) {
    const _id = req.params.personID;
    if (!UUID.isValid(_id)) {
        return res.status(400).end('Provided personID is not valid.');
    }
    try {
        const person = await Person.findByID(_id);
        if (person) {
            return res.status(200).json(person);
        }
        res.status(404).end('Person with this ID does not exist.');
    } catch (error) {
        res.status(500).end('Something went wrong.');
    }
}

export async function update(req, res) {
    const personID = req.params.personID;
    if (!UUID.isValid(personID)) {
        return res.status(400).end('Provided personID is not valid.');
    }
    try {
        const updated = await Person.updateOne({ _id: personID }, req.body);
        if (updated) {
            return res.status(200).json(updated);
        }
        res.status(404).end('Person with this ID does not exist.');
    } catch (error) {
        res.status(400).end(error.message);
    }
}

export async function remove(req, res) {
    const personID = req.params.personID;
    if (!UUID.isValid(personID)) {
        return res.status(400).end('Provided personID is not valid.');
    }
    try {
        const deleted = await Person.deleteByID(personID);
        if (deleted) {
            return res.status(204).json(deleted);
        }
        res.status(404).end('Person with this ID does not exist.');
    } catch (error) {
        res.status(500).end('Something went wrong.');
    }
}
