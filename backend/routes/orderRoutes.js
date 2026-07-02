import express from 'express';
import {
  getMyOrders,
  getMyOrderById,
  getAdminOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const customerRouter = express.Router();
const adminRouter = express.Router();

// Customer endpoints
customerRouter.get('/', authenticate, authorize('CUSTOMER'), getMyOrders);
customerRouter.get('/:id', authenticate, authorize('CUSTOMER'), getMyOrderById);

// Admin endpoints
adminRouter.get('/', authenticate, authorize('ADMIN'), getAdminOrders);
adminRouter.put('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export { customerRouter, adminRouter };
