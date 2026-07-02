import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 flex flex-col gap-3 group text-left"
    >
      <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100/50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 gap-1 select-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">No Image</span>
          </div>
        )}
        
        {/* Out of Stock overlay */}
        {Number(product.stock) === 0 && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 bg-rose-500 text-white text-xs font-extrabold rounded-full tracking-wider uppercase shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-extrabold tracking-wider uppercase text-purple-500/80 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
          {product.category?.name || 'Category'}
        </span>
        <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-600 transition-colors line-clamp-2 mt-1">
          {product.productName}
        </h3>
        <p className="font-extrabold text-slate-900 mt-auto text-base">
          {formatIDR(product.price)}
        </p>
        <span className="text-[11px] font-semibold text-slate-400 mt-1">
          Stock: {product.stock} items
        </span>
      </div>
    </Link>
  );
}
