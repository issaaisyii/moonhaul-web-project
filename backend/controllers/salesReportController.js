import prisma from '../utils/prisma.js';

// GET /api/admin/sales-report (Admin only)
export const getSalesReport = async (req, res) => {
  try {
    // 1. Fetch all orders for calculations
    const allOrders = await prisma.order.findMany({
      include: {
        payment: true,
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter paid orders (where paymentStatus is APPROVED)
    const paidOrders = allOrders.filter(
      (o) => o.payment && o.payment.paymentStatus === 'APPROVED'
    );

    // Summary calculation
    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    const totalOrders = allOrders.length;
    const deliveredOrders = allOrders.filter((o) => o.status === 'DELIVERED').length;
    const processingOrders = allOrders.filter((o) => o.status === 'PROCESSING').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const summary = {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      processingOrders,
      averageOrderValue
    };

    // 2. Monthly aggregation (grouping in-memory)
    const monthlyMap = {};
    for (const order of allOrders) {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const isPaid = order.payment && order.payment.paymentStatus === 'APPROVED';

      if (!monthlyMap[key]) {
        // Human readable month name
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthlyMap[key] = {
          month: monthName,
          totalOrders: 0,
          totalRevenue: 0
        };
      }

      monthlyMap[key].totalOrders += 1;
      if (isPaid) {
        monthlyMap[key].totalRevenue += parseFloat(order.totalAmount);
      }
    }

    // Sort by key desc (newest month first)
    const monthlyReport = Object.keys(monthlyMap)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => monthlyMap[key]);

    // 3. Top Selling Products
    // Get OrderItems of paid orders
    const paidOrderIds = paidOrders.map((o) => o.id);
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: paidOrderIds }
      }
    });

    const productMap = {};
    for (const item of orderItems) {
      const pid = item.productId || 0;
      if (!productMap[pid]) {
        productMap[pid] = {
          productId: pid,
          productName: item.productName,
          totalSold: 0,
          totalRevenue: 0
        };
      }
      productMap[pid].totalSold += item.quantity;
      productMap[pid].totalRevenue += parseFloat(item.subtotal);
    }

    const topSellingProducts = Object.values(productMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // 4. Recent Transactions (last 10 orders)
    const recentTransactions = allOrders.slice(0, 10).map((o) => ({
      orderNumber: o.id,
      customer: o.user?.name || 'Customer',
      totalPrice: parseFloat(o.totalAmount),
      status: o.status,
      createdAt: o.createdAt
    }));

    return res.status(200).json({
      summary,
      monthlyReport,
      topSellingProducts,
      recentTransactions
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
