import React, { useState, useEffect } from 'react';
import { getProductsApi } from '../../services/productService.js';
import { getCategoriesApi } from '../../services/categoryService.js';
import ProductGrid from '../../components/ProductGrid.jsx';
import ProductSearchBar from '../../components/ProductSearchBar.jsx';
import CategoryFilter from '../../components/CategoryFilter.jsx';
import ProductSkeleton from '../../components/ProductSkeleton.jsx';

export default function MerchandisePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesApi();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with search and category filters
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedCategoryId) params.categoryId = selectedCategoryId;

        const data = await getProductsApi(params);
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        if (active) {
          setError('Failed to retrieve merchandise. Please try again later.');
        }
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [search, selectedCategoryId]);

  const handleRetry = () => {
    setSearch('');
    setSelectedCategoryId(null);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/15 to-transparent p-8 md:p-12 rounded-3xl border border-slate-100 flex flex-col gap-2">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-600/75 bg-purple-50 px-3 py-1 rounded-full w-fit">
          Curated Merch
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-1">
          K-Pop Merchandise Pre-Order
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl leading-relaxed">
          Secure authentic albums, lightsticks, and exclusive goods directly from South Korea with premium quality.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <ProductSearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      {/* Merchandise Grid / Status States */}
      <div>
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={8} />
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50/50 border border-rose-100 rounded-2xl flex flex-col items-center gap-3 max-w-md mx-auto">
            <span className="text-rose-500 font-bold text-sm">{error}</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-rose-500 text-white font-semibold text-xs rounded-full hover:bg-rose-600 transition shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center bg-surface border border-border-custom rounded-3xl flex flex-col items-center gap-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-extrabold text-slate-800 text-lg">No merchandise found</h3>
              <p className="text-slate-400 text-xs font-semibold">
                We couldn't find any products matching your search term or selected category.
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-full hover:bg-purple-750 transition shadow-sm cursor-pointer"
            >
              Show All Merchandise
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
