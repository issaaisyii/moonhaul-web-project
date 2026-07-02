import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          MoonHaul
        </Link>
        <div className="flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
            Cart
          </NavLink>
          <NavLink to="/order-history" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
            Orders
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
            Profile
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-500'}`}>
            Admin
          </NavLink>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition rounded-full shadow-sm cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition rounded-full shadow-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
