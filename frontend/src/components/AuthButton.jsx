import React from 'react';

export default function AuthButton({
  type = 'submit',
  onClick,
  disabled = false,
  loading = false,
  children
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3.5 px-4 font-bold text-sm tracking-wide text-slate-800 rounded-2xl shadow-sm transition-all duration-250 flex items-center justify-center gap-2 ${
        disabled || loading
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          : 'bg-primary hover:bg-opacity-90 active:scale-[0.98] border border-primary/20 hover:shadow-md'
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
