import React from 'react';

export default function ProductSearchBar({ value, onChange, placeholder = 'Search merchandise...' }) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-surface border border-border-custom rounded-2xl text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 shadow-sm"
      />
    </div>
  );
}
