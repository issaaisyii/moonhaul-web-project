import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', end: true },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/merchandise', label: 'Merchandise' },
    { path: '/admin/customers', label: 'Customers' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/payment-verification', label: 'Payments' },
    { path: '/admin/sales-report', label: 'Sales Report' },
    { path: '/admin/profile', label: 'Profile' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-6 border-r border-slate-850 flex flex-col">
      <Link to="/" className="text-xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-8">
        MoonHaul Admin
      </Link>
      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm font-semibold hover:text-rose-400 transition cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
