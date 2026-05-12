import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // 1. Ghi log lỗi vào "Hộp đen" của chúng ta
  logger.error(`[${req.method}] ${req.path} >> StatusCode: ${err.statusCode}, Message: ${err.message}`);

  // Nếu là lỗi nghiêm trọng (500), chúng ta ghi thêm stack trace để dễ debug
  if (err.statusCode === 500) {
    logger.error(err.stack);
  }

  // 2. Trả về phản hồi đồng nhất cho Frontend
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
    // Chỉ hiện stack trace khi ở môi trường development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
