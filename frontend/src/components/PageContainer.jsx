import React from 'react';

export default function PageContainer({ children }) {
  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10">
      {children}
    </main>
  );
}
