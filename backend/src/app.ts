import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRouter from './routes/health.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// ─── App Factory ─────────────────────────────────────────────────────────────

const app: Application = express();

// --- Global Middleware -------------------------------------------------------
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Routes ------------------------------------------------------------------
app.use('/api/health', healthRouter);

// TODO: Register additional route modules here as the app grows
// app.use('/api/bookings', bookingsRouter);
// app.use('/api/vehicles', vehiclesRouter);

// --- Error Handling (must be last) -------------------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;
