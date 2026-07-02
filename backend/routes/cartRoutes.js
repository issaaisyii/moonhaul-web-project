import express from 'express';
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '../controllers/cartController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply customer authentication & authorization to all cart routes
router.use(authenticate, authorize('CUSTOMER'));

router.get('/', getCart);
router.post('/items', addCartItem);
router.put('/items/:id', updateCartItem);
router.delete('/items/:id', deleteCartItem);
router.delete('/clear', clearCart);

export default router;
