import prisma from '../utils/prisma.js';

// GET /api/admin/customers (Admin only)
export const getCustomersList = async (req, res) => {
  try {
    const { search, sort } = req.query;

    const whereClause = {
      role: 'CUSTOMER',
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'name') {
      orderBy = { name: 'asc' };
    }

    const customers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        orders: {
          select: {
            status: true,
            totalAmount: true
          }
        }
      },
      orderBy
    });

    const result = customers.map((c) => {
      const jumlahOrder = c.orders.length;
      const jumlahOrderAktif = c.orders.filter(
        (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
      ).length;
      const totalBelanja = c.orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
      const statusCustomer = jumlahOrder > 0 ? 'ACTIVE' : 'NEW';

      return {
        id: c.id,
        fullName: c.name,
        email: c.email,
        createdAt: c.createdAt,
        jumlahOrder,
        jumlahOrderAktif,
        totalBelanja,
        statusCustomer
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Get customers list error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
