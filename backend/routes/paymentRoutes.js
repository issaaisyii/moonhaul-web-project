import express from 'express';
import {
  uploadPayment,
  getMyPayments,
  getPayments,
  approvePayment,
  rejectPayment
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { uploadPaymentProof } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Customer endpoints
router.post('/upload', authenticate, authorize('CUSTOMER'), uploadPaymentProof.single('proof'), uploadPayment);
router.get('/my', authenticate, authorize('CUSTOMER'), getMyPayments);

// Admin endpoints
router.get('/', authenticate, authorize('ADMIN'), getPayments);
router.put('/:id/approve', authenticate, authorize('ADMIN'), approvePayment);
router.put('/:id/reject', authenticate, authorize('ADMIN'), rejectPayment);

export default router;
