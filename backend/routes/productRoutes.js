import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All product routes require authentication
router.use(authenticate);

// Public/authenticated access
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only access
router.post('/', authorize('ADMIN'), createProduct);
router.put('/:id', authorize('ADMIN'), updateProduct);
router.delete('/:id', authorize('ADMIN'), deleteProduct);

export default router;
