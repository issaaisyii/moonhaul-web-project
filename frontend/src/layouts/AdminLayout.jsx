import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar.jsx';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Admin Header */}
        <header className="bg-slate-900 border-b border-slate-850 px-8 py-4 flex items-center justify-between text-slate-300">
          <h2 className="text-sm font-bold text-slate-400">System Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 font-semibold bg-purple-950/50 border border-purple-800 text-purple-400 rounded-full">
              Super Admin
            </span>
            <Link to="/profile" className="text-sm font-semibold hover:text-slate-100 transition">
              Profile
            </Link>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-grow p-8 bg-slate-950 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
