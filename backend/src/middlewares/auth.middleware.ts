import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.config';
import { UserResponse } from '../types/auth.types';
import logger from '../utils/logger';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserResponse;
    logger.info(`[AUTH] User authenticated: ${decoded.userId} (Role: ${decoded.role})`);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`[AUTH] Token verification failed:`, error);
    res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
    return;
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserResponse;
    req.user = decoded;
    next();
  } catch (error) {
    // Nếu token lỗi, cứ coi như chưa login
    next();
  }
};
