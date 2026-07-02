import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomersApi } from '../../services/customerManagementService.js';

export default function CustomerManagementPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchCustomers = async () => {
    setError('');
    try {
      const params = { sort };
      if (search) params.search = search;

      const data = await getCustomersApi(params);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError('Could not retrieve customers registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, sort]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadgeClass = (status) => {
    return status === 'ACTIVE'
      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60'
      : 'bg-amber-950/40 text-amber-400 border border-amber-900/60';
  };

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Registry</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Monitor customer accounts, dates of registration, purchase statuses, and total transactions
        </p>
      </div>

      {/* Query Filter Controls */}
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
            placeholder="Search Name or Email..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="w-full sm:w-48 text-left">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-880 rounded-2xl text-slate-300 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="newest">Newest Customers</option>
            <option value="oldest">Oldest Customers</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading customer records...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-rose-400 font-bold text-sm">{error}</span>
            <button
              onClick={fetchCustomers}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition border border-slate-700"
            >
              Retry
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-2">
            <span className="text-slate-400 font-bold text-sm">No customers registered</span>
            <p className="text-slate-500 text-xs">Verify query parameters or customer records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300 animate-fade-in">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  <th scope="col" className="px-6 py-4">Joined Date</th>
                  <th scope="col" className="px-6 py-4">Total Orders</th>
                  <th scope="col" className="px-6 py-4">Active Orders</th>
                  <th scope="col" className="px-6 py-4">Total Spent</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-850/30 transition">
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">
                      {cust.fullName}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {cust.email}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(cust.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-400 text-center">
                      {cust.jumlahOrder}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-indigo-400 text-center">
                      {cust.jumlahOrderAktif}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-200">
                      {formatIDR(cust.totalBelanja)}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] ${getStatusBadgeClass(cust.statusCustomer)}`}>
                        {cust.statusCustomer}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <button
                        onClick={() => navigate(`/admin/orders?search=${encodeURIComponent(cust.email)}`)}
                        className="px-3.5 py-2 bg-slate-850 hover:bg-purple-950/30 hover:text-purple-400 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition cursor-pointer"
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
