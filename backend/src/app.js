import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../config/env.js';
import reviewRoutes from './routes/review.routes.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.allowedOrigin,
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json({ limit: '50kb' }));

app.use('/api/review', reviewRoutes);
app.use(notFoundHandler);

export default app;
