import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createBookingSchema } from '../validators/booking.validator';

const router = Router();
const bookingController = new BookingController();

// All booking routes require authentication
router.use(authenticate);

router.post('/', validateRequest(createBookingSchema), bookingController.create);
router.get('/my', bookingController.getMyBookings);
router.get('/manager', requireRole('MANAGER', 'ADMIN'), bookingController.getManagerBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id/cancel', bookingController.cancel);

export default router;
