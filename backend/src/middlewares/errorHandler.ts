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

  // 🚀 Intelligent Logging
  const logMessage = `[${req.method}] ${req.path} >> StatusCode: ${statusCode} >> ${message}`;
  
  if (statusCode >= 500) {
    logger.error(logMessage, err);
  } else if (statusCode >= 400) {
    logger.warn(logMessage);
  } else {
    logger.info(logMessage);
  }


  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
