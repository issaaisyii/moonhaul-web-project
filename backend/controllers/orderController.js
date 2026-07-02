import prisma from '../utils/prisma.js';

// Status hierarchy to prevent rollback
const statusHierarchy = {
  WAITING_PAYMENT: 1,
  PAYMENT_VERIFICATION: 2,
  PROCESSING: 3,
  PACKED: 4,
  SHIPPED: 5,
  DELIVERED: 6,
  CANCELLED: 7
};

// 1. GET /api/orders (Customer only)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        payment: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 2. GET /api/orders/:id (Customer only)
export const getMyOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Order ID.' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        items: true
      }
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Get my order detail error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 3. GET /api/admin/orders (Admin only)
export const getAdminOrders = async (req, res) => {
  try {
    const { search, status, sort } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      const searchInt = parseInt(search);
      where.OR = [
        {
          user: {
            name: { contains: search }
          }
        },
        {
          user: {
            email: { contains: search }
          }
        }
      ];

      if (!isNaN(searchInt)) {
        where.OR.push({ id: searchInt });
      }
    }

    let orderBy = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'createdAt_asc') orderBy = { createdAt: 'asc' };
      else if (sort === 'totalAmount_desc') orderBy = { totalAmount: 'desc' };
      else if (sort === 'totalAmount_asc') orderBy = { totalAmount: 'asc' };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payment: true,
        items: true
      },
      orderBy
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 4. PUT /api/admin/orders/:id/status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Order ID.' });
    }

    const { status: newStatus } = req.body;

    const validStatuses = ['WAITING_PAYMENT', 'PAYMENT_VERIFICATION', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid order status value.' });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const currentStatus = order.status;

    // Terminal statuses cannot transition further
    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
      return res.status(400).json({
        error: `Cannot transition status of a completed/cancelled order (${currentStatus}).`
      });
    }

    // Rollback check: new status hierarchy must be strictly greater than current status
    // Exception: transition to CANCELLED is allowed from any non-completed state
    if (newStatus !== 'CANCELLED') {
      if (statusHierarchy[newStatus] <= statusHierarchy[currentStatus]) {
        return res.status(400).json({
          error: `Status rollback is not allowed. Cannot change from "${currentStatus}" to "${newStatus}".`
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: {
        payment: true,
        items: true
      }
    });

    return res.status(200).json({
      message: 'Order status updated successfully.',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
