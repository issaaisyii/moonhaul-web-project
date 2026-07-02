import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardApi } from '../../services/adminDashboardService.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setError('');
    try {
      const stats = await getAdminDashboardApi();
      setData(stats);
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err);
      setError('Could not retrieve admin stats database.');
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

  const getOrderStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60';
      case 'CANCELLED':
        return 'bg-rose-950/40 text-rose-400 border border-rose-900/60';
      case 'WAITING_PAYMENT':
        return 'bg-amber-950/40 text-amber-400 border border-amber-900/60';
      case 'PAYMENT_VERIFICATION':
        return 'bg-purple-950/40 text-purple-400 border border-purple-900/60';
      default:
        return 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60';
      case 'REJECTED':
        return 'bg-rose-950/40 text-rose-400 border border-rose-900/60';
      case 'PENDING':
        return 'bg-amber-950/40 text-amber-400 border border-amber-900/60';
      default:
        return 'bg-slate-950/40 text-slate-500 border border-slate-900';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 text-left text-slate-100 animate-pulse">
        {/* Welcome Card Skeleton */}
        <div className="h-32 bg-slate-800 rounded-3xl w-full"></div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        {/* Lists & Shortcuts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-slate-800 rounded-3xl"></div>
          <div className="h-64 bg-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-4 text-slate-100">
        <span className="text-rose-400 font-bold text-sm">{error}</span>
        <button
          onClick={fetchDashboardData}
          className="px-5 py-2.5 bg-purple-600 text-white font-semibold text-xs rounded-full hover:bg-purple-700 transition shadow-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
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
  } = data;

  const isDatabaseEmpty = totalCustomer === 0 && totalCategory === 0 && totalMerchandise === 0 && totalOrders === 0;

  if (isDatabaseEmpty) {
    return (
      <div className="max-w-lg mx-auto my-12 p-16 text-center bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col items-center gap-4 text-slate-100">
        <div className="w-16 h-16 bg-slate-850 rounded-full flex items-center justify-center text-slate-500 border border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-white text-lg">Database is Empty</h3>
          <p className="text-slate-400 text-xs font-semibold">
            No customers, categories, products, or orders are present in the system yet.
          </p>
        </div>
        <Link
          to="/admin/categories"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-750 text-white font-bold text-xs rounded-full transition shadow-sm"
        >
          Add Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100 my-4 animate-fade-in">
      {/* 1. Welcome Card */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-xl">
        <div className="flex flex-col gap-1 z-10">
          <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-widest">
            Admin Panel Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs font-semibold text-slate-400 max-w-lg mt-1 leading-relaxed">
            Monitor store statistics, categorize pre-orders, verify payments, and keep track of delivery logistics.
          </p>
        </div>
        <div className="hidden md:block text-7xl opacity-5 select-none font-black text-purple-400 pointer-events-none">
          SYSTEM
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customers */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customers</span>
            <span className="text-xl font-black text-white mt-0.5">{totalCustomer}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-855 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-455">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 001.592 0l7.218-7.218a1.125 1.125 0 000-1.59l-9.58-9.58a2.25 2.25 0 00-1.591-.66z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
            <span className="text-xl font-black text-white mt-0.5">{totalCategory}</span>
          </div>
        </div>

        {/* Merchandise */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-pink-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Merchandise</span>
            <span className="text-xl font-black text-white mt-0.5">{totalMerchandise}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <span className="text-xl font-black text-white mt-0.5">{totalOrders}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Verification Payments */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verify Pending</span>
            <span className="text-xl font-black text-white mt-0.5">{pendingVerificationPaymentsCount}</span>
          </div>
        </div>

        {/* Processing Orders */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 9.75m0 0A5.98 5.98 0 0111.4 6v-.12m-.18.3a6 6 0 00-3.47 7.72M14.25 15.59l-.01.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Processing</span>
            <span className="text-xl font-black text-white mt-0.5">{processingOrdersCount}</span>
          </div>
        </div>

        {/* Shipped Orders */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12zm0 0h7.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shipped</span>
            <span className="text-xl font-black text-white mt-0.5">{shippedOrdersCount}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.267-.267c.928-.928 2.454-.928 3.382 0l.267.267a2.392 2.392 0 003.382 0l.267-.267M12 6V4m0 2a3 3 0 000 6m0 0a3 3 0 100 6M12 18v2m0-2h.008v.008H12V18z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue (Approved)</span>
            <span className="text-sm font-black text-white mt-0.5 truncate">{formatIDR(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-850 p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-extrabold text-white tracking-wide">Recent Transactions</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition">
              View All Orders
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No transactions recorded.</div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-850">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex justify-between gap-4 items-center">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white text-xs">Order #{tx.id}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      Customer: {tx.user?.name} ({tx.user?.email})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-300">{formatIDR(tx.totalAmount)}</span>
                    <span className={`px-2.5 py-0.5 rounded-full uppercase text-[8px] font-extrabold tracking-wider ${getOrderStatusBadgeClass(tx.status)}`}>
                      {tx.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registered Customers */}
        <div className="bg-slate-900 rounded-3xl border border-slate-855 p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-sm font-extrabold text-white tracking-wide">Recent Customers</h3>
            <Link to="/admin/customers" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition">
              View All
            </Link>
          </div>

          {recentCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No registered customer yet.</div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-850">
              {recentCustomers.map((c) => (
                <div key={c.id} className="py-3 flex flex-col gap-0.5 text-left">
                  <span className="font-bold text-white text-xs">{c.name}</span>
                  <span className="text-[10px] text-slate-500">{c.email}</span>
                  <span className="text-[9px] text-slate-600 font-medium">
                    Joined: {new Date(c.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Admin Quick Actions Shortcuts */}
      <div className="bg-slate-900 rounded-3xl border border-slate-850 p-6 md:p-8 shadow-xl flex flex-col gap-5">
        <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-850 pb-3">
          Quick Actions Shortcuts
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/categories"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Category Mgmt</span>
          </Link>
          <Link
            to="/admin/merchandise"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Product Mgmt</span>
          </Link>
          <Link
            to="/admin/orders"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Order Mgmt</span>
          </Link>
          <Link
            to="/admin/payment-verification"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Verify Payments</span>
          </Link>
          <Link
            to="/admin/sales-report"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Sales Reports</span>
          </Link>
          <Link
            to="/admin/customers"
            className="p-4 bg-slate-850 border border-slate-800 hover:bg-purple-950/20 hover:border-purple-600 rounded-2xl text-center text-xs font-bold text-slate-300 transition flex flex-col items-center gap-2"
          >
            <span>Customer List</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
