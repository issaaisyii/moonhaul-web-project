import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerDashboardApi } from '../../services/dashboardService.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setError('');
    try {
      const stats = await getCustomerDashboardApi();
      setData(stats);
    } catch (err) {
      console.error('Failed to load customer dashboard stats:', err);
      setError('Could not retrieve dashboard metrics. Please reload the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
    return (
      <div className="flex flex-col gap-6 text-left max-w-5xl mx-auto my-4 animate-pulse">
        {/* Welcome Card Skeleton */}
        <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
        {/* Shortcuts & Recent Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-3xl"></div>
          <div className="h-64 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error}</span>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-rose-500 text-white font-semibold text-xs rounded-full hover:bg-rose-600 transition shadow-sm cursor-pointer animate-bounce"
        >
          Retry
        </button>
      </div>
    );
  }

  const { name, activeOrdersCount, totalOrdersCount, cartItemsCount, totalSpending, recentOrders } = data;

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl mx-auto my-4 animate-fade-in">
      {/* 1. Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-primary/25 to-secondary/30 rounded-3xl border border-purple-100/50 p-6 md:p-8 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-extrabold uppercase text-purple-500 tracking-widest">
            Customer Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Annyeong, {name}! 👋
          </h1>
          <p className="text-xs font-semibold text-slate-500 max-w-md mt-1 leading-relaxed">
            Welcome back to MoonHaul. Track your ongoing pre-orders, manage items in your cart, and pre-order new merchandise catalogs!
          </p>
        </div>
        <div className="hidden md:block text-8xl opacity-15 select-none font-black text-purple-900 pointer-events-none">
          MH
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.077a1.97 1.97 0 00-.312-.993l-2.434-3.75a1.125 1.125 0 00-.947-.51H9.75M16.5 12h-.008v.008H16.5V12zm-3 0h-.008v.008H13.5V12z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Shipments</span>
            <span className="text-xl font-black text-slate-800 mt-0.5">{activeOrdersCount}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Transactions</span>
            <span className="text-xl font-black text-slate-800 mt-0.5">{totalOrdersCount}</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cart Quantity</span>
            <span className="text-xl font-black text-slate-800 mt-0.5">{cartItemsCount} pcs</span>
          </div>
        </div>

        {/* Total Spending */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spending</span>
            <span className="text-sm font-black text-slate-850 mt-0.5 truncate">{formatIDR(totalSpending)}</span>
          </div>
        </div>
      </div>

      {/* 3. Shortcuts and Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: 5 Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide">Recent Orders</h3>
            <Link to="/order-history" className="text-xs font-bold text-purple-600 hover:text-purple-750 transition">
              View All History
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <span className="text-slate-400 font-bold text-sm">No transaction records</span>
              <p className="text-slate-500 text-xs">Browse our catalogs to pre-order K-Pop goods!</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex justify-between gap-4 items-center">
                  <div className="flex flex-col gap-0.5 text-left">
                    <Link
                      to={`/order-history/${ord.id}`}
                      className="font-bold text-slate-850 hover:text-purple-600 transition text-sm"
                    >
                      Order #{ord.id}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Placed: {new Date(ord.createdAt).toLocaleDateString('id-ID')} - {formatIDR(ord.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full uppercase text-[9px] font-extrabold tracking-wider ${getStatusBadgeClass(
                        ord.status
                      )}`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Action Shortcuts */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide border-b border-slate-50 pb-3">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-2.5">
            <Link
              to="/"
              className="px-4 py-3 bg-slate-50 border border-slate-100 hover:bg-purple-50/20 hover:border-purple-200 hover:text-purple-600 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-between"
            >
              <span>Browse Catalog</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>

            <Link
              to="/cart"
              className="px-4 py-3 bg-slate-50 border border-slate-100 hover:bg-purple-50/20 hover:border-purple-200 hover:text-purple-600 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>

            <Link
              to="/order-history"
              className="px-4 py-3 bg-slate-50 border border-slate-100 hover:bg-purple-50/20 hover:border-purple-200 hover:text-purple-600 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-between"
            >
              <span>Order History</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>

            <Link
              to="/order-tracking"
              className="px-4 py-3 bg-slate-50 border border-slate-100 hover:bg-purple-50/20 hover:border-purple-200 hover:text-purple-600 rounded-2xl text-xs font-bold text-slate-600 transition flex items-center justify-between"
            >
              <span>Shipment Tracking</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
