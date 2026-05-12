import { Request, Response } from 'express';
import prisma from '../config/db.config';
import { asyncHandler } from '../utils/asyncHandler';

export class NotificationController {
  // Get all notifications for current user
  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: notifications });
  });

  // Mark notification as read
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  });

  // Mark all as read
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  });
}
