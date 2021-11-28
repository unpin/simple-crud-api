import Note from '../models/Note.js';
import Person from '../models/Person.js';
import UUID from '../utils/uuid/UUID.js';

export async function create(req, res) {
    try {
        const personID = req.body.personID;
        if (!UUID.isValid(personID)) {
            return res.status(400).end('Provided personID is not valid.');
        }
        const person = await Person.findByID(personID);
        if (!person) {
            return res.status(404).end('Person with this ID does not exist.');
        }
        const note = req.body;
        note.personID = personID;
        note.date = new Date();
        const created = await Note.createOne(note);
        res.status(201).json(created);
    } catch (error) {
        if (error instanceof SchemaValidationError) {
            return res.status(400).end(error.message);
        }
        console.error(error.message);
        res.status(500).end('Something went wrong.');
    }
}

export async function getPersonNotes(req, res) {
    const personID = req.params.personID;
    if (!UUID.isValid(personID)) {
        return res.status(400).end('Provided personID is not valid.');
    }
    try {
        const notes = await Note.findByPersonID(personID);
        res.status(200).json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).end('Something went wrong.');
    }
}
