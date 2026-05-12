import { Router } from 'express';
import { hotelController } from '../controllers/hotel.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createHotelSchema, updateHotelSchema } from '../validators/hotel.validator';

const router = Router();

router.get('/', hotelController.listHotels);
router.get('/my-hotels', authenticate, requireRole('MANAGER', 'ADMIN'), hotelController.getMyHotels);
router.get('/:id', hotelController.getHotel);

// Management routes
router.post('/', authenticate, requireRole('MANAGER', 'ADMIN'), validateRequest(createHotelSchema), hotelController.createHotel);
router.patch('/:id', authenticate, requireRole('MANAGER', 'ADMIN'), validateRequest(updateHotelSchema), hotelController.updateHotel);
router.delete('/:id', authenticate, requireRole('MANAGER', 'ADMIN'), hotelController.deleteHotel);

export default router;
