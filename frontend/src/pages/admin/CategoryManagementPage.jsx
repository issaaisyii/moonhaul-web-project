import React, { useState, useEffect } from 'react';
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../../services/categoryService.js';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    setError('');
    try {
      const data = await getCategoriesApi();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Could not retrieve categories list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setCategoryNameInput('');
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode('edit');
    setSelectedCategory(cat);
    setCategoryNameInput(cat.name);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = categoryNameInput.trim();
    if (!trimmedName) {
      setModalError('Category name is required.');
      return;
    }
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setModalError('Category name must be between 2 and 50 characters.');
      return;
    }

    setSubmitting(true);
    setModalError('');
    try {
      if (modalMode === 'add') {
        await createCategoryApi(trimmedName);
      } else {
        await updateCategoryApi(selectedCategory.id, trimmedName);
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      const msg = err.response?.data?.error || 'Category name may already exist. Please try another name.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (cat) => {
    setDeleteTarget(cat);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await deleteCategoryApi(deleteTarget.id);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Ensure it is not linked to any products.');
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Category Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Configure album and product categories for store katalog
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-purple-900/20 flex items-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Fetching categories...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-rose-400 font-bold text-sm">{error}</span>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition border border-slate-700"
            >
              Retry
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-2">
            <span className="text-slate-400 font-bold text-sm">No categories found</span>
            <p className="text-slate-500 text-xs">Try creating a category or resetting the search filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Category Name</th>
                  <th scope="col" className="px-6 py-4">Created At</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-850/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{cat.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(cat.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-fade-in flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-bold text-white">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {modalMode === 'add'
                  ? 'Create a category for catalog grouping.'
                  : 'Modify the existing category label.'}
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="e.g. Albums, Lightsticks"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200"
                  required
                  disabled={submitting}
                />
              </div>

              {modalError && (
                <span className="text-xs text-rose-400 font-semibold px-1">{modalError}</span>
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
                  {submitting ? 'Saving...' : 'Save Category'}
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
            <h3 className="text-lg font-bold text-white">Delete Category</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete the category <span className="font-extrabold text-white">"{deleteTarget.name}"</span>? This action cannot be undone.
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
