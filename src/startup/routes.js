import userRouter from '../routes/userRouter.js';

export default function (app) {
    app.use('/person', userRouter);
}
