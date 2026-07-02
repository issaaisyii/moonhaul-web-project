import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="mb-8 text-center">
        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          MoonHaul
        </Link>
        <p className="text-sm text-slate-400 font-semibold mt-1">Pre-Order K-Pop Merchandise</p>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
