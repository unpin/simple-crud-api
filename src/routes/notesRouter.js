import { Router } from '../lib/server/Server.js';
import * as NoteController from '../controller/NotesController.js';

const router = new Router();

router.post('/', NoteController.create);
router.get('/:personID', NoteController.getPersonNotes);

export default router;
