import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetailApi } from '../../services/orderService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderDetail = async () => {
    setError('');
    try {
      const data = await getOrderDetailApi(id);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError('Could not retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error || 'Order not found.'}</span>
        <Link
          to="/order-history"
          className="px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-full hover:bg-slate-700 transition shadow-sm"
        >
          Back to History
        </Link>
      </div>
    );
  }

  // Visual tracking setup
  const steps = [
    { key: 'WAITING_PAYMENT', label: 'Unpaid' },
    { key: 'PAYMENT_VERIFICATION', label: 'Verification' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'PACKED', label: 'Packed' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const currentStatusIndex = steps.findIndex(step => step.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl mx-auto my-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/order-history"
            className="text-xs font-bold text-slate-400 hover:text-purple-600 transition flex items-center gap-1.5 mb-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Order Details</h1>
          <p className="text-xs font-semibold text-slate-400">Order Reference ID: #{order.id}</p>
        </div>

        {isCancelled && (
          <span className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-xs font-extrabold tracking-wider uppercase select-none self-start sm:self-center">
            Order Cancelled
          </span>
        )}
      </div>

      {/* 1. Visual Progress Tracker (Only render if not Cancelled) */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Pre-Order Tracking</h3>
          
          <div className="relative flex justify-between items-center w-full mt-4">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-slate-100 z-0"></div>
            
            {/* Dynamic filled line */}
            {currentStatusIndex >= 0 && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-purple-400 transition-all duration-300 z-0"
                style={{
                  width: `${(currentStatusIndex / (steps.length - 1)) * 100}%`
                }}
              ></div>
            )}

            {/* Steps Nodes */}
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStatusIndex;
              const isActive = idx === currentStatusIndex;
              
              return (
                <div key={step.key} className="flex flex-col items-center gap-2.5 z-10 select-none">
                  {/* Circle indicator */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-primary border-primary text-slate-850 shadow-md shadow-primary/20 scale-110 font-bold'
                        : isCompleted
                        ? 'bg-purple-600 border-purple-600 text-white font-bold'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs">{idx + 1}</span>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[10px] md:text-xs font-bold tracking-tight text-center ${
                      isActive ? 'text-slate-850' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Order Breakdown Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ordered Merchandise</h3>

        {/* Item List */}
        <div className="flex flex-col divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-4 flex justify-between gap-4 items-center">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-bold text-slate-800 text-sm truncate">
                  {item.productName}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Quantity: {item.quantity} x {formatIDR(item.price)}
                </span>
              </div>
              <span className="text-sm font-black text-slate-700 shrink-0">
                {formatIDR(parseFloat(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-600">{formatIDR(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Shipping Cost</span>
            <span className="text-emerald-500 font-black">Free Shipping (Promo)</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4 items-center">
            <span className="font-extrabold text-slate-800 text-sm">Total Paid</span>
            <span className="text-lg font-black text-slate-900">{formatIDR(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* 3. Payment Status & Action Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-5">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Payment Status</h3>

        <div className="flex items-center justify-between text-sm border-b border-slate-50 pb-3">
          <span className="font-bold text-slate-400">Verification Status</span>
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

        {/* Feedback / rejection notes */}
        {order.payment?.paymentStatus === 'REJECTED' && order.payment?.notes && (
          <div className="p-4 bg-rose-50/40 border border-rose-100 text-rose-600 rounded-2xl text-xs font-medium">
            <span className="font-bold">Admin Rejection Feedback:</span> {order.payment.notes}
          </div>
        )}

        {/* Render link to upload/re-upload receipt */}
        {order.status === 'WAITING_PAYMENT' && (
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-xs text-slate-400 font-semibold text-center sm:text-left">
              Please transfer your payment of <span className="font-extrabold text-slate-800">{formatIDR(order.totalAmount)}</span> to Bank Moon (123-456-7890) and upload the receipt proof below:
            </p>
            <Link
              to={`/payment-upload/${order.id}`}
              className="w-full py-4 bg-purple-600 hover:bg-purple-750 text-white font-extrabold text-sm rounded-2xl transition shadow-sm text-center flex items-center justify-center"
            >
              Upload Payment Proof
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
