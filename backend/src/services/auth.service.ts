import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.config';
import { AuthResponse, GoogleProfile, ApplyManagerDTO, UpdateApplicationDTO } from '../types/auth.types';
import { env } from '../config/env.config';
import { MailService } from './mail.service';
import { getIO } from '../config/socket.config';
import logger from '../utils/logger';

export class AuthService {
  private readonly jwtSecret = env.JWT_SECRET || 'super-secret';
  private readonly jwtRefreshSecret = env.JWT_REFRESH_SECRET || 'super-refresh-secret';
  private readonly mailService = new MailService();

  sendOTP = async (email: string): Promise<void> => {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode: hashedCode,
          verificationCodeExpires: expires,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          verificationCode: hashedCode,
          verificationCodeExpires: expires,
          role: 'USER',
        },
      });
    }

    await this.mailService.sendOTP(email, code);
  };

  verifyOTP = async (email: string, code: string): Promise<AuthResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.verificationCode || !user.verificationCodeExpires) {
      throw new Error('Invalid or expired verification code');
    }

    if (user.verificationCodeExpires < new Date()) {
      throw new Error('Verification code has expired');
    }

    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) {
      throw new Error('Invalid verification code');
    }

    // Clear code after successful verification
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return this.generateTokens(updatedUser.id, updatedUser.role);
  };

  googleLogin = async (profile: GoogleProfile): Promise<AuthResponse> => {
    if (!profile.emails || profile.emails.length === 0) {
      throw new Error('Google account must have an email associated.');
    }

    const email = profile.emails[0].value;
    const googleId = profile.id;

    // Try to get the best possible name
    const name = profile.displayName ||
      (profile._json?.name) ||
      (`${profile._json?.given_name || ''} ${profile._json?.family_name || ''}`).trim() ||
      email.split('@')[0];

    const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : (profile._json?.picture || null);

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        // Update existing email-based user with Google info
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatar,
            name: user.name ? user.name : name // Keep existing name if present, otherwise use Google's
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            name,
            avatar,
            role: 'USER',
          },
        });
      }
    } else {
      // Sync info if it changed for existing Google user
      const updates: any = {};
      if (avatar && user.avatar !== avatar) updates.avatar = avatar;
      if (name && user.name !== name) updates.name = name;

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    }

    return this.generateTokens(user.id, user.role);
  };

  updateProfile = async (userId: string, data: { name?: string; phone?: string }): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
  };

  applyManager = async (userId: string, data: ApplyManagerDTO): Promise<void> => {
    const existingApp = await prisma.managerApplication.findUnique({
      where: { userId }
    });

    if (existingApp) {
      throw new Error('You have already submitted an application');
    }

    // Check for existing bookings
    const hasBookings = await prisma.booking.findFirst({
      where: { userId }
    });

    if (hasBookings) {
      throw new Error('Users with existing bookings cannot apply for manager status. Please complete or cancel your bookings first.');
    }

    // Create application with PENDING status. NO automatic role upgrade.
    const { hotelName, hotelAddress, phone, businessLicense, hotelDescription } = data as any;

    const application = await prisma.managerApplication.create({
      data: {
        userId,
        hotelName,
        hotelAddress,
        hotelDescription,
        phone,
        businessLicense,
        status: 'PENDING'
      },
      include: { user: { select: { name: true, email: true } } }
    });

    // Notify Admin via Socket
    try {
      const io = getIO();
      io.to('admin_room').emit('new_application', application);
    } catch (e) { }
  };

  listApplications = async (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => {
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
  };

  updateApplicationStatus = async (applicationId: string, data: UpdateApplicationDTO): Promise<void> => {
    logger.info(`[AUTH_SERVICE] Fetching application: ${applicationId}`);
    const application = await prisma.managerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });

    if (!application) {
      logger.error(`[AUTH_SERVICE] Application ${applicationId} NOT FOUND`);
      throw new Error('Application not found');
    }

    logger.info(`[AUTH_SERVICE] Starting transaction for application: ${applicationId} (${data.status})`);

    await prisma.$transaction(async (tx) => {
      // 1. Update application status
      await tx.managerApplication.update({
        where: { id: applicationId },
        data: {
          status: data.status,
          adminComment: data.adminComment
        }
      });

      // 2. If approved, upgrade User to MANAGER and CREATE HOTEL
      if (data.status === 'APPROVED') {
        await tx.user.update({
          where: { id: application.userId },
          data: {
            role: 'MANAGER',
            phone: application.phone // Sync phone to user profile
          }
        });

        // AUTO-CREATE HOTEL: Sài lại data từ đơn ứng tuyển
        await tx.hotel.create({
          data: {
            ownerId: application.userId,
            name: application.hotelName,
            address: application.hotelAddress,
            description: "A new luxury hotel waiting for details...",
            location_lat: 0,
            location_lng: 0,
            status: 'APPROVED'
          }
        });
      }
    });

    // 2.5 Create in-app notification
    try {
      await prisma.notification.create({
        data: {
          userId: application.userId,
          title: data.status === 'APPROVED' ? 'Application Approved!' : 'Manager Application Update',
          message: data.status === 'APPROVED'
            ? `Welcome! Your application for ${application.hotelName} has been approved.`
            : `Update on your application for ${application.hotelName}. Check your email for details.`,
          type: data.status === 'APPROVED' ? 'SUCCESS' : 'WARNING'
        }
      });
    } catch (e) { }

    // 3. Send email notification
    await this.mailService.sendApplicationResult(
      application.user.email,
      data.status,
      data.adminComment
    );
  };

  forgotPassword = async (email: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists for security
      return;
    }

    const resetToken = jwt.sign(
      { userId: user.id, type: 'reset-password' },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordReset(email, resetUrl);
  };

  resetPassword = async (data: any): Promise<void> => {
    const { token, newPassword } = data;

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      if (decoded.type !== 'reset-password') {
        throw new Error('Invalid token type');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password_hash: hashedPassword }
      });
    } catch (error: any) {
      throw new Error(error.message || 'Invalid or expired reset token');
    }
  };

  private generateTokens = (userId: string, role: string): AuthResponse => {
    const accessToken = jwt.sign({ userId, role }, this.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId, role }, this.jwtRefreshSecret, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      user: { userId, role }
    };
  };
}
