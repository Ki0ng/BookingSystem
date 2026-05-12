import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { sendOTPSchema, verifyOTPSchema, resetPasswordSchema } from '../middlewares/auth.validator';
import { applyManagerSchema, updateApplicationSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const authController = new AuthController();

// OTP Authentication
router.post('/send-otp', validateRequest(sendOTPSchema), authController.sendOTP);
router.post('/verify-otp', validateRequest(verifyOTPSchema), authController.verifyOTP);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);
router.post('/apply-manager', authenticate, validateRequest(applyManagerSchema), authController.applyManager);
router.post('/logout', authController.logout);

router.post('/forgot-password', validateRequest(sendOTPSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// Admin only routes
router.get('/applications', authenticate, requireRole('ADMIN'), authController.listApplications);
router.patch('/applications/:id', authenticate, requireRole('ADMIN'), validateRequest(updateApplicationSchema), authController.updateApplicationStatus);

export default router;
