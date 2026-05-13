import prisma from '../config/db.config';
import { Notification, Prisma } from '@prisma/client';

export class NotificationRepository {
  async create(notificationData: Prisma.NotificationUncheckedCreateInput): Promise<Notification> {
    return prisma.notification.create({ data: notificationData });
  }
}
