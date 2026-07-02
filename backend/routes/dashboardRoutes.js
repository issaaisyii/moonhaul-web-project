import express from 'express';
import { getCustomerDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/customer', authenticate, authorize('CUSTOMER'), getCustomerDashboard);

export default router;
