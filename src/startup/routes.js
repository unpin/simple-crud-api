import userRouter from '../routes/personRouter.js';
import notesRouter from '../routes/notesRouter.js';

export default function (app) {
    app.use('/person', userRouter);
    app.use('/notes', notesRouter);
}
