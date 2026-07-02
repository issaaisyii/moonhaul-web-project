import express from 'express';
import { checkout } from '../controllers/checkoutController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply customer authentication & authorization to checkout
router.post('/', authenticate, authorize('CUSTOMER'), checkout);

export default router;
