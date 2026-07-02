import React from 'react';

export default function CategoryFilter({ categories, selectedCategoryId, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${
          selectedCategoryId === null
            ? 'bg-primary/40 border-primary text-slate-800 shadow-sm'
            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
        }`}
      >
        All Items
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 border cursor-pointer ${
            selectedCategoryId === cat.id
              ? 'bg-primary/40 border-primary text-slate-800 shadow-sm'
              : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
