import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/error.middleware.js';

import router from './modules/users/user.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// as rotas deverão seguir POST /users/register exemplo
app.use('/users', router)


// Middleware de erro SEMPRE por último
app.use(errorHandler)

export default app;