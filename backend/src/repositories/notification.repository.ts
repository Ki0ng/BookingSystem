import prisma from '../config/db.config';
import { Notification, Prisma } from '@prisma/client';

export class NotificationRepository {
  async create(notificationData: Prisma.NotificationUncheckedCreateInput): Promise<Notification> {
    return prisma.notification.create({ data: notificationData });
  }

  async findManyByUserId(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}
