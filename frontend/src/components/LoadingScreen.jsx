import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold animate-pulse text-sm">Loading MoonHaul...</p>
      </div>
    </div>
  );
}
