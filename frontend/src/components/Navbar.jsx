import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCustomer = isAuthenticated && user?.role === 'CUSTOMER';
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={isAdmin ? "/admin" : isCustomer ? "/dashboard" : "/"} className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          MoonHaul
        </Link>
        <div className="flex items-center gap-6">
          {/* Dashboard link for Customer */}
          {isCustomer && (
            <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
              Dashboard
            </NavLink>
          )}

          {/* Shop is accessible to Customer and Guest */}
          {(!isAuthenticated || isCustomer) && (
            <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
              Shop
            </NavLink>
          )}

          {/* Customer only links */}
          {isCustomer && (
            <>
              <NavLink to="/cart" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
                Cart
              </NavLink>
              <NavLink to="/order-history" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
                Orders
              </NavLink>
              <NavLink to="/order-tracking" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
                Tracking
              </NavLink>
            </>
          )}

          {/* Admin only links */}
          {isAdmin && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
                Admin Panel
              </NavLink>
              <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
                Shop Preview
              </NavLink>
            </>
          )}

          {/* Profile link for logged in users */}
          {isAuthenticated && (
            <NavLink to={isAdmin ? "/admin/profile" : "/profile"} className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
              Profile
            </NavLink>
          )}

          {/* Auth buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition rounded-full shadow-sm cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition rounded-full shadow-sm">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-purple-600 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition rounded-full shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
