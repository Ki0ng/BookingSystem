import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Stack:', err.stack);

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

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
