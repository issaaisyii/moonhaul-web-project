import express from 'express';
import { getSalesReport } from '../controllers/salesReportController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getSalesReport);

export default router;
