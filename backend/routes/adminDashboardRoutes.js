import express from 'express';
import { getAdminDashboard } from '../controllers/adminDashboardController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/admin', authenticate, authorize('ADMIN'), getAdminDashboard);

export default router;
