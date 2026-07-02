import React from 'react';

export default function TextInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  name,
  required = false
}) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-surface border rounded-2xl text-slate-700 text-sm placeholder-slate-400 focus:outline-none transition-all duration-250 ${
          error
            ? 'border-rose-300 focus:ring-2 focus:ring-rose-100'
            : 'border-border-custom focus:border-primary focus:ring-4 focus:ring-primary/20'
        }`}
      />
      {error && <span className="text-xs text-rose-500 font-medium ml-2">{error}</span>}
    </div>
  );
}
