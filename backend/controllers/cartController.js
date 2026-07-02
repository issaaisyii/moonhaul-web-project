import prisma from '../utils/prisma.js';

// Helper to get or lazy-create cart for the user
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  return cart;
};

// 1. GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 2. POST /api/cart/items
export const addCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validation
    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({ error: 'Valid Product ID is required.' });
    }

    const parsedProductId = parseInt(productId);

    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity is required and must be an integer of at least 1.' });
    }

    // Verify product exists and check stock
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const cart = await getOrCreateCart(req.user.id);

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.productId === parsedProductId);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        error: `Insufficient stock. Available stock: ${product.stock}, requested total quantity: ${newQuantity}.`
      });
    }

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parsedProductId,
          quantity,
        },
        include: { product: true }
      });
    }

    return res.status(200).json({
      message: 'Item added/updated in cart successfully.',
      cartItem
    });
  } catch (error) {
    console.error('Add cart item error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 3. PUT /api/cart/items/:id
export const updateCartItem = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);
    if (isNaN(cartItemId)) {
      return res.status(400).json({ error: 'Invalid cart item ID.' });
    }

    const { quantity } = req.body;

    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity is required and must be an integer of at least 1.' });
    }

    // Verify cart item exists and belongs to current user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true
      }
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found in your cart.' });
    }

    // Check stock
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({
        error: `Insufficient stock. Available stock: ${cartItem.product.stock}.`
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true }
    });

    return res.status(200).json({
      message: 'Cart item updated successfully.',
      cartItem: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 4. DELETE /api/cart/items/:id
export const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);
    if (isNaN(cartItemId)) {
      return res.status(400).json({ error: 'Invalid cart item ID.' });
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ error: 'Cart item not found in your cart.' });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return res.status(200).json({
      message: 'Cart item deleted successfully.'
    });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 5. DELETE /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return res.status(200).json({
      message: 'Cart cleared successfully.'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
