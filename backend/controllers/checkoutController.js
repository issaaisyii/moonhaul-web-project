import prisma from '../utils/prisma.js';

// POST /api/checkout
export const checkout = async (req, res) => {
  try {
    // 1. Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty. Add products before checking out.' });
    }

    // 2. Verify stock availability for all items before starting the transaction
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product "${item.product.productName}". Available stock: ${item.product.stock}, in cart: ${item.quantity}.`
        });
      }
    }

    // 3. Calculate total amount
    let totalAmount = 0;
    const orderItemsData = cart.items.map(item => {
      const price = parseFloat(item.product.price);
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      return {
        productId: item.productId,
        productName: item.product.productName,
        price,
        quantity: item.quantity,
        subtotal
      };
    });

    // 4. Perform atomic database transaction
    const order = await prisma.$transaction(async (tx) => {
      // a. Deduct product stocks
      for (const item of cart.items) {
        // Fetch fresh product stock details inside the transaction to prevent race conditions
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${item.product.productName}" during checkout processing.`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: product.stock - item.quantity
          }
        });
      }

      // b. Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount: totalAmount,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: true
        }
      });

      // c. Clear all items from the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return res.status(201).json({
      message: 'Checkout successful. Order placed.',
      order
    });
  } catch (error) {
    console.error('Checkout error:', error);
    if (error.message && error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error during checkout.' });
  }
};
