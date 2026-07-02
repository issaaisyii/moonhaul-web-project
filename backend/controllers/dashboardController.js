import prisma from '../utils/prisma.js';

// GET /api/dashboard/customer
export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get customer name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 2. Active orders count (not DELIVERED and not CANCELLED)
    const activeOrdersCount = await prisma.order.count({
      where: {
        userId,
        status: {
          notIn: ['DELIVERED', 'CANCELLED']
        }
      }
    });

    // 3. Total orders count
    const totalOrdersCount = await prisma.order.count({
      where: { userId }
    });

    // 4. Cart items count (sum of all item quantities)
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true
      }
    });
    const cartItemsCount = cart
      ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    // 5. Total transaction nominal (excluding CANCELLED orders)
    const ordersForSpending = await prisma.order.findMany({
      where: {
        userId,
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        totalAmount: true
      }
    });
    const totalSpending = ordersForSpending.reduce(
      (sum, ord) => sum + parseFloat(ord.totalAmount),
      0
    );

    // 6. Max 5 recent orders
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true
      }
    });

    return res.status(200).json({
      name: user.name,
      activeOrdersCount,
      totalOrdersCount,
      cartItemsCount,
      totalSpending,
      recentOrders
    });
  } catch (error) {
    console.error('Customer dashboard stats error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
