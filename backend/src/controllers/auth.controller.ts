import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env.config';

const authService = new AuthService();

export class AuthController {
  sendOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await authService.sendOTP(email);
    res.status(200).json({ success: true, message: 'Verification code sent to your email' });
  });

  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;
    const authTokens = await authService.verifyOTP(email, code);
    this.setCookies(res, authTokens.accessToken, authTokens.refreshToken);
    res.status(200).json({ 
      success: true, 
      message: 'Logged in successfully', 
      user: authTokens.user,
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken
    });
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });

  googleCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const googleUserData = req.user;
    
    if (googleUserData?.accessToken && googleUserData?.refreshToken) {
      // For production (cross-domain), we send tokens via URL params
      // The frontend login-success page will handle saving them
      const redirectUrl = new URL(`${env.FRONTEND_URL}/login-success`);
      redirectUrl.searchParams.append('accessToken', googleUserData.accessToken);
      redirectUrl.searchParams.append('refreshToken', googleUserData.refreshToken);
      
      // Still set cookies for same-domain support if needed
      this.setCookies(res, googleUserData.accessToken, googleUserData.refreshToken);
      
      res.redirect(redirectUrl.toString());
    } else {
      throw new Error('Authentication failed');
    }
  });

  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as any).userId;
    const userProfile = await authService.getProfile(userId);
    res.status(200).json({ success: true, user: userProfile });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as any).userId;
    await authService.updateProfile(userId, req.body);
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  });
  
  applyManager = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as any).userId;
    await authService.applyManager(userId, req.body);
    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully. Please wait for admin approval.' 
    });
  });

  listApplications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.query;
    const managerApplications = await authService.listApplications(status as any);
    res.status(200).json({ success: true, data: managerApplications });
  });

  updateApplicationStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await authService.updateApplicationStatus(id, req.body);
    res.status(200).json({ success: true, message: `Application ${req.body.status.toLowerCase()} successfully` });
  });
  
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ 
      success: true, 
      message: 'If an account exists, a reset link has been sent to your email' 
    });
  });
  
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await authService.resetPassword(req.body);
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  });

  private setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    const isProduction = env.NODE_ENV === 'production';
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  };
}
