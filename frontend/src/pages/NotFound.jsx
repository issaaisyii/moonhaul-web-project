import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm max-w-md">
        <h1 className="text-6xl font-black text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="inline-block px-6 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition rounded-full shadow-sm">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
