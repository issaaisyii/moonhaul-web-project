import prisma from '../utils/prisma.js';

// 1. POST /api/payments/upload (Customer only)
export const uploadPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId || isNaN(parseInt(orderId))) {
      return res.status(400).json({ error: 'Valid Order ID is required.' });
    }

    const parsedOrderId = parseInt(orderId);

    // Verify file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Payment proof image is required.' });
    }

    // Verify order exists and belongs to current user
    const order = await prisma.order.findUnique({
      where: { id: parsedOrderId },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Check if payment already exists for this order
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: parsedOrderId }
    });

    if (existingPayment && existingPayment.paymentStatus === 'APPROVED') {
      return res.status(400).json({ error: 'This order has already been paid and approved.' });
    }

    const proofImage = `/uploads/payments/${req.file.filename}`;

    let payment;
    if (existingPayment) {
      // Re-upload/update if rejected or pending
      payment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          proofImage,
          paymentStatus: 'PENDING',
          uploadedAt: new Date(),
          verifiedAt: null,
          notes: null
        }
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          orderId: parsedOrderId,
          proofImage,
          paymentStatus: 'PENDING'
        }
      });
    }

    // Sync associated order status to PAYMENT_VERIFICATION
    await prisma.order.update({
      where: { id: parsedOrderId },
      data: { status: 'PAYMENT_VERIFICATION' }
    });

    return res.status(201).json({
      message: 'Payment proof uploaded successfully. Pending admin verification.',
      payment
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 2. GET /api/payments/my (Customer only)
export const getMyPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        order: {
          userId: req.user.id
        }
      },
      include: {
        order: true
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Get my payments error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 3. GET /api/payments (Admin only)
export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 4. PUT /api/payments/:id/approve (Admin only)
export const approvePayment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Payment ID.' });
    }

    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: 'APPROVED',
        verifiedAt: new Date(),
        notes: null
      }
    });

    // Sync associated order status to PROCESSING
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PROCESSING' }
    });

    return res.status(200).json({
      message: 'Payment verified and approved successfully.',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// 5. PUT /api/payments/:id/reject (Admin only)
export const rejectPayment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid Payment ID.' });
    }

    const { notes } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        paymentStatus: 'REJECTED',
        verifiedAt: new Date(),
        notes: notes || 'Declined by admin.'
      }
    });

    // Sync associated order status back to WAITING_PAYMENT
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'WAITING_PAYMENT' }
    });

    return res.status(200).json({
      message: 'Payment rejected successfully.',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
