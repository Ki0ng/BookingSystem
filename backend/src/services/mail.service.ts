import nodemailer from 'nodemailer';
import { env } from '../config/env.config';
import logger from '../utils/logger';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_PORT === '465',
      auth: env.SMTP_USER && env.SMTP_PASS ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      } : undefined,
    });
  }

  sendOTP = async (to: string, code: string): Promise<void> => {
    const mailOptions = {
      from: env.SMTP_FROM,
      to,
      subject: 'Your Elite Booking Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #2563eb; text-align: center;">ELITE BOOKING</h2>
          <p>Hello,</p>
          <p>Use the following verification code to sign in to your account. This code will expire in 10 minutes.</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            &copy; 2024 Elite Booking System. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`[MAIL] OTP sent to ${to}`);
    } catch (error) {
      logger.error('[MAIL] Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  };

  sendApplicationResult = async (to: string, status: 'APPROVED' | 'REJECTED', comment?: string): Promise<void> => {
    const isApproved = status === 'APPROVED';
    const subject = isApproved 
      ? 'Congratulations! Your Manager Application is Approved' 
      : 'Update on Your Manager Application';

    const mailOptions = {
      from: env.SMTP_FROM,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: ${isApproved ? '#10b981' : '#ef4444'}; text-align: center;">ELITE BOOKING</h2>
          <p>Hello,</p>
          <p>${isApproved 
            ? 'We are pleased to inform you that your application to become a Hotel Manager on Elite Booking has been <strong>APPROVED</strong>.' 
            : 'Thank you for your interest in becoming a Manager at Elite Booking. After reviewing your profile, we are unable to approve your application at this time.'}</p>
          
          ${comment ? `<div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #6b7280; margin: 20px 0;">
            <strong>Admin Comment:</strong><br/>
            ${comment}
          </div>` : ''}

          ${isApproved ? `
          <p>You can now access the Manager Dashboard and start listing your hotels.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.FRONTEND_URL}/manager/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
          ` : '<p>If you have any questions, please contact our support team.</p>'}

          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            &copy; 2024 Elite Booking System. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`[MAIL] Application result sent to ${to}`);
    } catch (error) {
      logger.error('[MAIL] Error sending application result email:', error);
    }
  };

  sendPasswordReset = async (to: string, resetUrl: string): Promise<void> => {
    const mailOptions = {
      from: env.SMTP_FROM,
      to,
      subject: 'Reset Your Elite Booking Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">ELITE BOOKING</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            &copy; 2024 Elite Booking System. All rights reserved.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`[MAIL] Password reset link sent to ${to}`);
    } catch (error) {
      logger.error('[MAIL] Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  };
}
