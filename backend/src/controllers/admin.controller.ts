import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthService } from '../services/auth.service';
import { ApplicationRepository } from '../repositories/application.repository';
import { UserRepository } from '../repositories/user.repository';
import { HotelRepository } from '../repositories/hotel.repository';
import logger from '../utils/logger';

const authService = new AuthService();
const appRepository = new ApplicationRepository();
const userRepository = new UserRepository();
const hotelRepository = new HotelRepository();

export class AdminController {
  // Get all pending hotel/manager applications
  getPendingApplications = asyncHandler(async (req: Request, res: Response) => {
    const pendingApplications = await appRepository.list('PENDING');
    res.status(200).json({ success: true, data: pendingApplications });
  });

  // Approve or Reject Manager Application
  handleApplication = asyncHandler(async (req: Request, res: Response) => {
    const { id: applicationId } = req.params;
    const { status, adminComment } = req.body; // status: APPROVED or REJECTED

    logger.info(`[ADMIN] Processing application ${applicationId} with status ${status}`);

    try {
      await authService.updateApplicationStatus(applicationId, { status, adminComment });
      logger.info(`[ADMIN] Successfully processed application ${applicationId}`);
    } catch (error: any) {
      logger.error(`[ADMIN] Error processing application ${applicationId}:`, error);
      throw error;
    }

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} processed successfully`
    });
  });

  // Manage Users
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const systemUsers = await userRepository.findAll();
    res.status(200).json({ success: true, data: systemUsers });
  });

  // Manage Hotels
  getAllHotels = asyncHandler(async (req: Request, res: Response) => {
    const systemHotels = await hotelRepository.findAll();
    res.status(200).json({ success: true, data: systemHotels });
  });
}
