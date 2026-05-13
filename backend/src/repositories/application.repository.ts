import prisma from '../config/db.config';
import { ManagerApplication, Prisma } from '@prisma/client';

export class ApplicationRepository {
  async findByUserId(userId: string): Promise<ManagerApplication | null> {
    return prisma.managerApplication.findUnique({ where: { userId } });
  }

  async findById(applicationId: string): Promise<any | null> {
    return prisma.managerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });
  }

  async create(applicationData: Prisma.ManagerApplicationUncheckedCreateInput): Promise<any> {
    return prisma.managerApplication.create({
      data: applicationData,
      include: { user: { select: { name: true, email: true } } }
    });
  }

  async list(status?: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<any[]> {
    return prisma.managerApplication.findMany({
      where: status ? { status } : {},
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });
  }

  async updateStatus(applicationId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', adminComment?: string): Promise<ManagerApplication> {
    return prisma.managerApplication.update({
      where: { id: applicationId },
      data: {
        status,
        adminComment
      }
    });
  }
}
