import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import adoptionRoutes from './routes/adoptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
