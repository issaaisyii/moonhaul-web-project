import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-8 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-400">
          © {new Date().getFullYear()} MoonHaul. K-Pop Merchandise Pre-Order.
        </p>
        <p className="text-xs text-slate-400">
          Designed with Korean Modern Aesthetic.
        </p>
      </div>
    </footer>
  );
}
