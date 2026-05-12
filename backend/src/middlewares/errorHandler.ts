import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'Unique constraint failed on the database.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }

  // Log error with stack trace using improved Winston logger
  logger.error(`[${req.method}] ${req.path} >> ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

