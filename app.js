import Server from './src/lib/server/Server.js';
import routes from './src/startup/routes.js';
import database from './src/startup/database.js';

const app = new Server({ timeout: 2000 });

app.use(Server.json);

routes(app);
database();

process
    .on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    })
    .on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });

export default app;
