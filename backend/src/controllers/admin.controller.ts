import { Request, Response } from 'express';
import prisma from '../config/db.config';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';
import logger from '../utils/logger';

const authService = new AuthService();

export class AdminController {
  // Get all pending hotel/manager applications
  getPendingApplications = asyncHandler(async (req: Request, res: Response) => {
    const applications = await prisma.managerApplication.findMany({
      where: { status: 'PENDING' },
      include: { user: true }
    });
    res.status(200).json({ success: true, data: applications });
  });

  // Approve or Reject Manager Application
  handleApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminComment } = req.body; // status: APPROVED or REJECTED

    logger.info(`[ADMIN] Processing application ${id} with status ${status}`);

    try {
      await authService.updateApplicationStatus(id, { status, adminComment });
      logger.info(`[ADMIN] Successfully processed application ${id}`);
    } catch (error: any) {
      logger.error(`[ADMIN] Error processing application ${id}:`, error);
      throw error;
    }

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} processed successfully`
    });
  });

  // Manage Users
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: users });
  });

  // Manage Hotels
  getAllHotels = asyncHandler(async (req: Request, res: Response) => {
    const hotels = await prisma.hotel.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: hotels });
  });
}
