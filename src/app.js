import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Exemplo de rota inicial só pra teste
app.get('/', (req, res) => {
    res.json({ msg: 'Locadora de DVDs API' });
});


// Middleware de erro SEMPRE por último
app.use(errorHandler)

export default app;