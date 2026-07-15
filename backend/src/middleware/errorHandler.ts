import { Request, Response, NextFunction } from 'express';

/**
 * Catch-all 404 handler — mount AFTER all other routes.
 */
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Global error handler — must have 4 parameters so Express recognises it.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[Error] ${err.message}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
