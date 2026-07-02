import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

// Public/authenticated access
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only access
router.post('/', authorize('ADMIN'), createCategory);
router.put('/:id', authorize('ADMIN'), updateCategory);
router.delete('/:id', authorize('ADMIN'), deleteCategory);

export default router;
