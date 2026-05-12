import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`[ROLE] Access denied for user ${req.user.userId}. Required: ${allowedRoles}, Found: ${req.user.role}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to access this resource.' 
      });
    }

    logger.info(`[ROLE] Access granted for role: ${req.user.role}`);

    next();
  };
};
