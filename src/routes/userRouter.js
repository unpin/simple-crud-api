import { Router } from '../lib/server/Server.js';
import * as PersonController from '../controller/PersonController.js';

const router = new Router();

router.post('/', PersonController.create);
router.get('/', PersonController.getAll);
router.get('/:personID', PersonController.getByID);
router.put('/:personID', PersonController.update);
router.delete('/:personID', PersonController.remove);

export default router;
