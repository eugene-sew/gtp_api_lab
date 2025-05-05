import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@middlewares/globalErrorHandler';

import { apiRequestLogger } from '@logger/logger';

import { rootRouter } from '@routes/index';

import { specs } from './config/swagger';

const app = express();

app.use(
    cors({
        origin: '*',
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRequestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/healthz', (req, res) => {
    return res.send('healthy');
});

app.use('/api/', rootRouter);

app.use(errorHandler);

export { app };
