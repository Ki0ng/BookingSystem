import prisma from '../config/db.config';
import { AuthResponse, GoogleProfile, ApplyManagerDTO, UpdateApplicationDTO } from '../types/auth.types';
import { env } from '../config/env.config';
import { MailService } from './mail.service';
import { socketService } from './socket.service';
import { UserRepository } from '../repositories/user.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { HotelRepository } from '../repositories/hotel.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { AuthUtils } from '../utils/auth.utils';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/constants';

export class AuthService {
  private readonly jwtSecret = env.JWT_SECRET || 'super-secret';
  private readonly jwtRefreshSecret = env.JWT_REFRESH_SECRET || 'super-refresh-secret';
  private readonly mailService = new MailService();
  private readonly userRepository = new UserRepository();
  private readonly appRepository = new ApplicationRepository();
  private readonly bookingRepository = new BookingRepository();
  private readonly hotelRepository = new HotelRepository();
  private readonly notificationRepository = new NotificationRepository();

  sendOTP = async (email: string): Promise<void> => {
    const { code, hash, expires } = await AuthUtils.generateOTP();
    await this.userRepository.upsertVerificationCode(email, hash, expires);
    await this.mailService.sendOTP(email, code);
  };

  verifyOTP = async (email: string, code: string): Promise<AuthResponse> => {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.verificationCode || !user.verificationCodeExpires) throw new Error('Invalid code');
    if (user.verificationCodeExpires < new Date()) throw new Error('Expired code');

    const isMatch = await AuthUtils.compareOTP(code, user.verificationCode);
    if (!isMatch) throw new Error('Invalid code');

    await this.userRepository.clearVerificationCode(user.id);
    return AuthUtils.generateTokens(user.id, user.role, this.jwtSecret, this.jwtRefreshSecret);
  };

  googleLogin = async (profile: GoogleProfile): Promise<AuthResponse> => {
    if (!profile.emails?.[0]) throw new Error('Email required');
    const email = profile.emails[0].value;
    const googleId = profile.id;
    const name = profile.displayName || email.split('@')[0];
    const avatar = profile.photos?.[0]?.value || null;

    let user = await this.userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await this.userRepository.findByEmail(email);
      if (user) user = await this.userRepository.update(user.id, { googleId, avatar, name: user.name || name });
      else user = await this.userRepository.create({ email, googleId, name, avatar, role: 'USER' });
    } else {
      await this.syncGoogleProfile(user.id, user.name, user.avatar, name, avatar);
    }
    return AuthUtils.generateTokens(user.id, user.role, this.jwtSecret, this.jwtRefreshSecret);
  };

  private syncGoogleProfile = async (userId: string, currentName: string, currentAvatar: string | null, newName: string, newAvatar: string | null) => {
    const profileUpdates: any = {};
    if (newAvatar && currentAvatar !== newAvatar) profileUpdates.avatar = newAvatar;
    if (newName && currentName !== newName) profileUpdates.name = newName;
    if (Object.keys(profileUpdates).length > 0) await this.userRepository.update(userId, profileUpdates);
  };

  getProfile = async (userId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  };

  updateProfile = async (userId: string, profileData: any) => {
    return this.userRepository.update(userId, profileData);
  };

  applyManager = async (userId: string, applicationData: ApplyManagerDTO) => {
    await this.validateManagerApplication(userId);
    const application = await this.appRepository.create({ userId, ...applicationData, status: 'PENDING' });
    socketService.emitToAdmin('new_application', application);
  };

  private validateManagerApplication = async (userId: string) => {
    if (await this.appRepository.findByUserId(userId)) throw new Error('Already applied');
    if (await this.bookingRepository.findFirstByUserId(userId)) throw new Error('Existing bookings');
  };

  listApplications = async (status?: any) => this.appRepository.list(status);

  updateApplicationStatus = async (applicationId: string, statusUpdate: UpdateApplicationDTO) => {
    const application = await this.appRepository.findById(applicationId);
    if (!application) throw new Error('Not found');

    await this.processApplicationUpdate(application.id, application.userId, application.phone, application.hotelName, application.hotelAddress, statusUpdate);
    await this.createStatusNotification(application.userId, application.hotelName, statusUpdate.status);
    await this.mailService.sendApplicationResult(application.user.email, statusUpdate.status, statusUpdate.adminComment);
  };

  private processApplicationUpdate = async (applicationId: string, applicantUserId: string, hotelPhone: string, hotelName: string, hotelAddress: string, statusUpdate: UpdateApplicationDTO) => {
    await prisma.$transaction(async (tx) => {
      await tx.managerApplication.update({ where: { id: applicationId }, data: { status: statusUpdate.status, adminComment: statusUpdate.adminComment } });
      if (statusUpdate.status === 'APPROVED') {
        await tx.user.update({ where: { id: applicantUserId }, data: { role: 'MANAGER', phone: hotelPhone } });
        await tx.hotel.create({ data: { ownerId: applicantUserId, name: hotelName, address: hotelAddress, description: "New hotel", location_lat: 0, location_lng: 0, status: 'APPROVED' } });
      }
    });
  };

  private createStatusNotification = async (userId: string, hotelName: string, status: any) => {
    try {
      await this.notificationRepository.create({
        userId,
        title: status === 'APPROVED' ? 'Approved!' : 'Update',
        message: status === 'APPROVED' ? `Welcome ${hotelName}` : `Update for ${hotelName}`,
        type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING'
      });
    } catch (e) {}
  };

  forgotPassword = async (email: string) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;
    const resetToken = jwt.sign({ userId: user.id, type: AUTH_CONFIG.RESET_PASSWORD_TOKEN_TYPE }, this.jwtSecret, { expiresIn: AUTH_CONFIG.RESET_PASSWORD_TOKEN_EXPIRY });
    await this.mailService.sendPasswordReset(email, `${env.FRONTEND_URL}/reset-password?token=${resetToken}`);
  };

  resetPassword = async (resetData: any) => {
    const decodedToken = jwt.verify(resetData.token, this.jwtSecret) as any;
    if (decodedToken.type !== AUTH_CONFIG.RESET_PASSWORD_TOKEN_TYPE) throw new Error('Invalid');
    await this.userRepository.updatePassword(decodedToken.userId, await AuthUtils.hashPassword(resetData.newPassword));
  };
}
