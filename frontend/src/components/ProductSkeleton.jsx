import React from 'react';

export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm animate-pulse flex flex-col gap-4">
          <div className="bg-slate-100 rounded-2xl w-full aspect-square"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
            <div className="h-5 bg-slate-100 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded-md w-1/4 mt-2"></div>
          </div>
        </div>
      ))}
    </>
  );
}
