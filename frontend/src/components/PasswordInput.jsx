import React, { useState } from 'react';

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  name,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-4 pr-12 py-3 bg-surface border rounded-2xl text-slate-700 text-sm placeholder-slate-400 focus:outline-none transition-all duration-250 ${
            error
              ? 'border-rose-300 focus:ring-2 focus:ring-rose-100'
              : 'border-border-custom focus:border-primary focus:ring-4 focus:ring-primary/20'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition"
        >
          {showPassword ? (
            // Eye Slash Icon (Heroicons style)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M21 21l-18-18m18 18L3 3m18 18l-3.86-3.86m-1.21-1.21A3 3 0 0012 9.75c-1.657 0-3 1.343-3 3 0 .485.115.943.32 1.348M20.005 8.223a10.477 10.477 0 00-1.934-3.773M16.5 16.5L12 12m0 0l-4.5 4.5" />
            </svg>
          ) : (
            // Eye Icon (Heroicons style)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      {error && <span className="text-xs text-rose-500 font-medium ml-2">{error}</span>}
    </div>
  );
}
