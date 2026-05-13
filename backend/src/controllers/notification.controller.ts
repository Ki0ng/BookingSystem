import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { NotificationRepository } from '../repositories/notification.repository';

const notificationRepository = new NotificationRepository();

export class NotificationController {
  // Get all notifications for current user
  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    const userNotifications = await notificationRepository.findManyByUserId(userId);
    res.status(200).json({ success: true, data: userNotifications });
  });

  // Mark notification as read
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id: notificationId } = req.params;
    await notificationRepository.markAsRead(notificationId);
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  });

  // Mark all as read
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    await notificationRepository.markAllAsRead(userId);
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  });
}
