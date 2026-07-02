import React, { useState, useEffect } from 'react';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../../services/productService.js';
import { getCategoriesApi } from '../../services/categoryService.js';

export default function MerchandiseManagementPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form input states
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete target state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesApi();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProducts = async () => {
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCategoryId) params.categoryId = filterCategoryId;

      const data = await getProductsApi(params);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Could not retrieve merchandise list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filterCategoryId]);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setFormName('');
    setFormPrice('');
    setFormStock('');
    setFormCategoryId(categories[0]?.id || '');
    setFormDescription('');
    setFormImageUrl('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setModalMode('edit');
    setSelectedProduct(prod);
    setFormName(prod.productName);
    setFormPrice(prod.price.toString());
    setFormStock(prod.stock.toString());
    setFormCategoryId(prod.categoryId);
    setFormDescription(prod.description || '');
    setFormImageUrl(prod.imageUrl || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    const name = formName.trim();
    if (!name || name.length < 2 || name.length > 100) {
      setFormError('Product name must be between 2 and 100 characters.');
      return;
    }

    const price = parseFloat(formPrice);
    if (isNaN(price) || price <= 0) {
      setFormError('Price must be a valid number greater than 0.');
      return;
    }

    const stock = parseInt(formStock);
    if (isNaN(stock) || stock < 0) {
      setFormError('Stock must be an integer equal or greater than 0.');
      return;
    }

    if (!formCategoryId) {
      setFormError('Please select a valid category.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const payload = {
      productName: name,
      price,
      stock,
      categoryId: parseInt(formCategoryId),
      description: formDescription.trim() || null,
      imageUrl: formImageUrl.trim() || null,
    };

    try {
      if (modalMode === 'add') {
        await createProductApi(payload);
      } else {
        await updateProductApi(selectedProduct.id, payload);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      const msg = err.response?.data?.error || 'Failed to save product. Ensure name is unique in this category.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (prod) => {
    setDeleteTarget(prod);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteProductApi(deleteTarget.id);
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to remove product.');
      setLoading(false);
    }
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Merchandise Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Create, view, modify, and delete K-Pop merchandise products
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-purple-900/20 flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Merchandise
        </button>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-56 text-left flex flex-col gap-1">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading merchandise catalog...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-rose-400 font-bold text-sm">{error}</span>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition border border-slate-700"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-2">
            <span className="text-slate-400 font-bold text-sm">No products found</span>
            <p className="text-slate-500 text-xs">Create items or modify the search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-6 py-4">Image</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Stock</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-850/30 transition">
                    {/* Image Preview Column */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-600 uppercase">Empty</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">
                      {prod.productName}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span className="bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full">
                        {prod.category?.name || 'Category'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-100">
                      {formatIDR(prod.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-xs font-bold ${Number(prod.stock) === 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {prod.stock} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3 items-center min-h-[80px]">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(prod)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-fade-in flex flex-col gap-5 my-8">
            <div>
              <h3 className="text-lg font-bold text-white">
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure listing fields for retail merchandising
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. BTS Proof Album"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200"
                    required
                  />
                </div>

                {/* Category select */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-300 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Price (IDR)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 600000"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="e.g. http://example.com/bts.jpg"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200"
                />
              </div>

              {/* Image Preview block */}
              {formImageUrl && (
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Preview</span>
                  <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={formImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detail catalog description of K-Pop goods..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 h-24 resize-none"
                />
              </div>

              {formError && (
                <span className="text-xs text-rose-400 font-semibold px-1">{formError}</span>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-purple-900/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white">Delete Merchandise</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete <span className="font-extrabold text-white">"{deleteTarget.productName}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-rose-900/20 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
