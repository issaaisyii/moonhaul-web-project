import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAdminOrdersApi, updateOrderStatusApi } from '../../services/orderService.js';

const statusHierarchy = {
  WAITING_PAYMENT: 1,
  PAYMENT_VERIFICATION: 2,
  PROCESSING: 3,
  PACKED: 4,
  SHIPPED: 5,
  DELIVERED: 6,
  CANCELLED: 7
};

const statusesList = [
  'WAITING_PAYMENT',
  'PAYMENT_VERIFICATION',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

export default function OrderManagementPage() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [sort, setSort] = useState('createdAt_desc');

  const fetchOrders = async () => {
    setError('');
    try {
      const params = { sort };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;

      const data = await getAdminOrdersApi(params);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setError('Could not retrieve orders database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, filterStatus, sort]);

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    if (newStatus === currentStatus) return;

    // Direct check in UI (already handled by disabling options, but extra safety check)
    if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
      alert('Completed or cancelled orders cannot be modified.');
      return;
    }

    if (newStatus !== 'CANCELLED') {
      if (statusHierarchy[newStatus] <= statusHierarchy[currentStatus]) {
        alert('Status rollback is not allowed.');
        return;
      }
    }

    if (!window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) {
      return;
    }

    try {
      await updateOrderStatusApi(orderId, newStatus);
      // Inline refresh of specific order to prevent full list loading state blink
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.id === orderId ? { ...ord, status: newStatus } : ord
        )
      );
    } catch (err) {
      console.error('Update status failed:', err);
      alert(err.response?.data?.error || 'Failed to update order status.');
    }
  };

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

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Order Management</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Monitor transaction timelines, process shipments, and manage customer order states
        </p>
      </div>

      {/* Filter and Query Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Name, Email, or Order ID..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition focus:ring-opacity-40"
          />
        </div>

        {/* Filter Status */}
        <div className="w-full sm:w-48 text-left">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statusesList.map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort orders */}
        <div className="w-full sm:w-48 text-left">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="createdAt_desc">Newest Orders</option>
            <option value="createdAt_asc">Oldest Orders</option>
            <option value="totalAmount_desc">Highest Cost</option>
            <option value="totalAmount_asc">Lowest Cost</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-rose-400 font-bold text-sm">{error}</span>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition border border-slate-700"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-2">
            <span className="text-slate-400 font-bold text-sm">No orders found</span>
            <p className="text-slate-500 text-xs">Verify query parameters or customer checkouts.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-6 py-4">Order ID</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Payment</th>
                  <th scope="col" className="px-6 py-4">Total</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {orders.map((order) => {
                  const isTerminal = order.status === 'DELIVERED' || order.status === 'CANCELLED';

                  return (
                    <tr key={order.id} className="hover:bg-slate-850/30 transition">
                      <td className="px-6 py-4 font-mono font-bold text-purple-400">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{order.user?.name || 'Customer'}</span>
                          <span className="text-xs text-slate-500">{order.user?.email || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            order.payment?.paymentStatus === 'APPROVED'
                              ? 'text-emerald-400'
                              : order.payment?.paymentStatus === 'REJECTED'
                              ? 'text-rose-400'
                              : order.payment?.paymentStatus === 'PENDING'
                              ? 'text-amber-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {order.payment?.paymentStatus || 'UNPAID'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-200">
                        {formatIDR(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold">
                        <span className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] ${getStatusBadgeClass(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end items-center min-h-[70px]">
                        <select
                          value={order.status}
                          disabled={isTerminal}
                          onChange={(e) =>
                            handleStatusChange(order.id, order.status, e.target.value)
                          }
                          className="px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                        >
                          {statusesList.map((st) => {
                            // Dropdown validation rules to prevent status rollback
                            const currentLvl = statusHierarchy[order.status];
                            const selectLvl = statusHierarchy[st];
                            
                            // CANCELLED is allowed to be picked from any non-terminal state
                            const isAllowed =
                              st === order.status ||
                              (st === 'CANCELLED' && !isTerminal) ||
                              selectLvl > currentLvl;

                            return (
                              <option key={st} value={st} disabled={!isAllowed}>
                                {st.replace('_', ' ')}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
