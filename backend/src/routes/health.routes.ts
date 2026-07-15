/**
 * Health-check route
 * GET /api/health
 */
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    message: 'Travels Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

export default router;
