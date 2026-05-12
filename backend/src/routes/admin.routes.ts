import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes are protected
router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/applications', adminController.getPendingApplications);
router.patch('/applications/:id', adminController.handleApplication);
router.get('/users', adminController.getAllUsers);
router.get('/hotels', adminController.getAllHotels);

export default router;
