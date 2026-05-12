import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public/Auth optional routes
router.get('/hotel/:hotelId', optionalAuthenticate, reviewController.getHotelReviews);
router.get('/platform', reviewController.getPlatformReviews);

// User routes
router.post('/', authenticate, reviewController.createReview);
router.patch('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

// Manager/Admin routes
router.get('/stats', authenticate, requireRole('MANAGER', 'ADMIN'), reviewController.getStats);
router.patch('/:id/status', authenticate, requireRole('MANAGER', 'ADMIN'), reviewController.updateStatus);
router.patch('/:id/visibility', authenticate, requireRole('MANAGER', 'ADMIN'), reviewController.toggleVisibility);
router.post('/:id/reply', authenticate, requireRole('MANAGER', 'ADMIN'), reviewController.replyToReview);

export default router;
