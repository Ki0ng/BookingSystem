import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const roomController = new RoomController();

// All room routes are protected and for MANAGERS/ADMINS
router.use(authenticate);
router.use(requireRole('MANAGER', 'ADMIN'));

router.post('/', roomController.createRoom);
router.get('/hotel/:hotelId', roomController.getHotelRooms);
router.patch('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;
