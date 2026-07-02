import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersApi } from '../../services/orderService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setError('');
    try {
      const data = await getOrdersApi();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to retrieve your order history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'WAITING_PAYMENT':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'PAYMENT_VERIFICATION':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      default:
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error}</span>
        <button
          onClick={fetchOrders}
          className="px-5 py-2.5 bg-rose-500 text-white font-semibold text-xs rounded-full hover:bg-rose-600 transition shadow-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-12 p-16 text-center bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-slate-800 text-lg">No orders placed yet</h3>
          <p className="text-slate-400 text-xs font-semibold">
            Your shopping history is empty. Start pre-ordering merchandise now!
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 px-6 py-3 bg-purple-600 hover:bg-purple-750 text-white font-bold text-sm rounded-full transition shadow-sm"
        >
          Browse Merchandise
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Order History
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          View all your previous pre-orders and transaction receipts
        </p>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          return (
            <Link
              key={order.id}
              to={`/order-history/${order.id}`}
              className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-purple-200 shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-slate-800 text-sm">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-semibold mt-1">
                  Items: {totalItems} pcs
                </span>
                <span className="text-sm font-black text-slate-900 mt-1">
                  {formatIDR(order.totalAmount)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 mt-2 md:mt-0">
                {/* Payment Status Badge */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Payment
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${
                      order.payment?.paymentStatus === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : order.payment?.paymentStatus === 'REJECTED'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : order.payment?.paymentStatus === 'PENDING'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {order.payment?.paymentStatus || 'UNPAID'}
                  </span>
                </div>

                {/* Order Status Badge */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Order Status
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400 ml-2 hidden md:block">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
