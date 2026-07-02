import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersApi } from '../../services/orderService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function OrderTrackingPage() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActiveOrders = async () => {
    setError('');
    try {
      const data = await getOrdersApi();
      // Filter only active orders (exclude DELIVERED and CANCELLED)
      const active = data.filter(
        (order) => order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
      );
      setActiveOrders(active);
    } catch (err) {
      console.error('Failed to load active orders:', err);
      setError('Could not retrieve tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const steps = [
    { key: 'WAITING_PAYMENT', label: 'Unpaid' },
    { key: 'PAYMENT_VERIFICATION', label: 'Verifying' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'PACKED', label: 'Packed' },
    { key: 'SHIPPED', label: 'Shipped' }
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error}</span>
        <button
          onClick={fetchActiveOrders}
          className="px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-full hover:bg-slate-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-12 p-16 text-center bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.077a1.97 1.97 0 00-.312-.993l-2.434-3.75a1.125 1.125 0 00-.947-.51H9.75M16.5 12h-.008v.008H16.5V12zm-3 0h-.008v.008H13.5V12z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-slate-800 text-lg">No active shipments</h3>
          <p className="text-slate-400 text-xs font-semibold">
            All your orders are delivered or completed. View complete order history instead.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/order-history"
            className="px-5 py-2.5 border border-slate-200 text-slate-500 font-bold text-xs rounded-full hover:bg-slate-50 transition"
          >
            Order History
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-750 text-white font-bold text-xs rounded-full transition shadow-sm"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Active Shipments
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Track the ongoing delivery progress of your items in real time
        </p>
      </div>

      {/* Tracker list */}
      <div className="flex flex-col gap-6">
        {activeOrders.map((order) => {
          const currentStatusIndex = steps.findIndex((step) => step.key === order.status);
          const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-black text-slate-800 text-sm">Order #{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Placed: {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <Link
                  to={`/order-history/${order.id}`}
                  className="text-xs font-bold text-purple-600 hover:text-purple-750 transition flex items-center gap-0.5"
                >
                  Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>

              {/* Progress timeline preview */}
              <div className="relative flex justify-between items-center w-full my-2">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-slate-100 z-0"></div>
                {currentStatusIndex >= 0 && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-purple-400 transition-all duration-300 z-0"
                    style={{
                      width: `${(currentStatusIndex / (steps.length - 1)) * 100}%`
                    }}
                  ></div>
                )}

                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStatusIndex;
                  const isActive = idx === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-primary border-primary text-slate-800 font-bold scale-110'
                            : isCompleted
                            ? 'bg-purple-600 border-purple-600 text-white font-bold'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className="text-[9px]">{idx + 1}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
