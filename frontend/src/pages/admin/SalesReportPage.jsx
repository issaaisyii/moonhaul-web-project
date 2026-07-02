import React, { useState, useEffect } from 'react';
import { getSalesReportApi } from '../../services/salesReportService.js';

export default function SalesReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSalesReport = async () => {
    setError('');
    try {
      const report = await getSalesReportApi();
      setData(report);
    } catch (err) {
      console.error('Failed to load sales report:', err);
      setError('Could not retrieve sales registry metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
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

  if (loading) {
    return (
      <div className="flex flex-col gap-6 text-left text-slate-100 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="h-32 bg-slate-800 rounded-3xl w-full"></div>
        {/* Summary Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
        </div>
        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-800 rounded-3xl"></div>
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
          onClick={fetchSalesReport}
          className="px-5 py-2.5 bg-purple-600 text-white font-semibold text-xs rounded-full hover:bg-purple-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { summary, monthlyReport, topSellingProducts, recentTransactions } = data;

  const isReportEmpty = summary.totalOrders === 0;

  if (isReportEmpty) {
    return (
      <div className="max-w-lg mx-auto my-12 p-16 text-center bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col items-center gap-4 text-slate-100">
        <div className="w-16 h-16 bg-slate-850 rounded-full flex items-center justify-center text-slate-500 border border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.267-.267c.928-.928 2.454-.928 3.382 0l.267.267a2.392 2.392 0 003.382 0l.267-.267M12 6V4m0 2a3 3 0 000 6m0 0a3 3 0 100 6M12 18v2m0-2h.008v.008H12V18z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-white text-lg">No Sales Data</h3>
          <p className="text-slate-400 text-xs font-semibold">
            There are no transactions in the database to compile reports from.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100 my-4 animate-fade-in">
      {/* 1. Header welcome */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-xl">
        <div className="flex flex-col gap-1 z-10">
          <span className="text-[10px] font-extrabold uppercase text-purple-400 tracking-widest">
            Sales & Revenue Analytics
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Admin Sales Report
          </h1>
          <p className="text-xs font-semibold text-slate-400 max-w-lg mt-1 leading-relaxed">
            Analyze shopping revenues, monthly sales orders, best-selling products, and recent invoice logs.
          </p>
        </div>
        <div className="hidden md:block text-7xl opacity-5 select-none font-black text-purple-400 pointer-events-none">
          SALES
        </div>
      </div>

      {/* 2. Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-450">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.267-.267c.928-.928 2.454-.928 3.382 0l.267.267a2.392 2.392 0 003.382 0l.267-.267M12 6V4m0 2a3 3 0 000 6m0 0a3 3 0 100 6M12 18v2m0-2h.008v.008H12V18z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <span className="text-base font-black text-white mt-0.5 truncate">{formatIDR(summary.totalRevenue)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-center text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <span className="text-base font-black text-white mt-0.5">{summary.totalOrders}</span>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-center text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivered Orders</span>
            <span className="text-base font-black text-white mt-0.5">{summary.deliveredOrders}</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-850 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-center text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Value</span>
            <span className="text-base font-black text-white mt-0.5 truncate">{formatIDR(summary.averageOrderValue)}</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Reporting Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Report Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-850 p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-850 pb-3 text-left">
            Monthly Revenue Recap
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-950/30 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-4 py-3">Month</th>
                  <th scope="col" className="px-4 py-3 text-center">Total Orders</th>
                  <th scope="col" className="px-4 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {monthlyReport.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/20 transition">
                    <td className="px-4 py-3 font-bold text-white">{m.month}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-400">{m.totalOrders}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">{formatIDR(m.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-slate-900 rounded-3xl border border-slate-850 p-6 md:p-8 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-850 pb-3 text-left">
            Top Selling Merchandise
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-950/30 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center">Rank</th>
                  <th scope="col" className="px-4 py-3">Product Name</th>
                  <th scope="col" className="px-4 py-3 text-center">Total Sold</th>
                  <th scope="col" className="px-4 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {topSellingProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/20 transition">
                    <td className="px-4 py-3 text-center font-mono font-bold text-purple-400">#{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-white truncate max-w-[150px]">{p.productName}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-400">{p.totalSold} pcs</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">{formatIDR(p.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions */}
      <div className="bg-slate-900 rounded-3xl border border-slate-850 p-6 md:p-8 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-850 pb-3 text-left">
          Invoice Transaction Logs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[10px] font-bold text-slate-400 uppercase bg-slate-950/30 border-b border-slate-850">
              <tr>
                <th scope="col" className="px-4 py-3">Order ID</th>
                <th scope="col" className="px-4 py-3">Customer</th>
                <th scope="col" className="px-4 py-3 text-center">Status</th>
                <th scope="col" className="px-4 py-3">Total Amount</th>
                <th scope="col" className="px-4 py-3 text-right">Invoice Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {recentTransactions.map((tx) => (
                <tr key={tx.orderNumber} className="hover:bg-slate-850/20 transition">
                  <td className="px-4 py-3 font-mono font-bold text-purple-400">#{tx.orderNumber}</td>
                  <td className="px-4 py-3 font-bold text-white">{tx.customer}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full uppercase text-[8px] font-extrabold tracking-wider ${getOrderStatusBadgeClass(tx.status)}`}>
                      {tx.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-300">{formatIDR(tx.totalPrice)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
