import prisma from '../utils/prisma.js';

// GET /api/dashboard/admin
export const getAdminDashboard = async (req, res) => {
  try {
    // 1. User counts
    const totalCustomer = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    const totalAdmin = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    // 2. Catalog counts
    const totalCategory = await prisma.category.count();
    const totalMerchandise = await prisma.product.count();

    // 3. Order status breakdowns
    const totalOrders = await prisma.order.count();

    const waitingPaymentOrdersCount = await prisma.order.count({
      where: { status: 'WAITING_PAYMENT' }
    });

    const pendingVerificationPaymentsCount = await prisma.payment.count({
      where: { paymentStatus: 'PENDING' }
    });

    const processingOrdersCount = await prisma.order.count({
      where: { status: 'PROCESSING' }
    });

    const shippedOrdersCount = await prisma.order.count({
      where: { status: 'SHIPPED' }
    });

    // 4. Total revenue (Sum totalAmount from orders where payment is APPROVED)
    const approvedOrders = await prisma.order.findMany({
      where: {
        payment: {
          paymentStatus: 'APPROVED'
        }
      },
      select: {
        totalAmount: true
      }
    });
    const totalRevenue = approvedOrders.reduce(
      (sum, ord) => sum + parseFloat(ord.totalAmount),
      0
    );

    // 5. Recent 5 transactions (Orders)
    const recentTransactions = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        payment: true
      }
    });

    // 6. Recent 5 registered customers
    const recentCustomers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return res.status(200).json({
      totalCustomer,
      totalAdmin,
      totalCategory,
      totalMerchandise,
      totalOrders,
      waitingPaymentOrdersCount,
      pendingVerificationPaymentsCount,
      processingOrdersCount,
      shippedOrdersCount,
      totalRevenue,
      recentTransactions,
      recentCustomers
    });
  } catch (error) {
    console.error('Admin dashboard stats query error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
