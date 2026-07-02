import express from 'express';
import { getCustomersList } from '../controllers/customerManagementController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getCustomersList);

export default router;
