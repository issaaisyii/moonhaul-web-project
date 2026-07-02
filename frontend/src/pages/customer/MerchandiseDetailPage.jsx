import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByIdApi } from '../../services/productService.js';
import { addCartItemApi } from '../../services/cartService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function MerchandiseDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cart actions states
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductByIdApi(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product detail:', err);
        setError('Merchandise not found or failed to load. Please return to the shop.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setErrorMsg('Please sign in to add items to your cart.');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      setErrorMsg('Only customers are allowed to add items to the cart.');
      return;
    }

    setAdding(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await addCartItemApi(product.id, quantity);
      setSuccessMsg('Successfully added item to your cart!');
      setQuantity(1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      const msg = err.response?.data?.error || 'Failed to add item. Please try again.';
      setErrorMsg(msg);
    } finally {
      setAdding(false);
    }
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error || 'Product not found'}</span>
        <Link
          to="/"
          className="px-5 py-2.5 bg-rose-500 text-white font-semibold text-xs rounded-full hover:bg-rose-600 transition shadow-sm"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-purple-600 transition w-fit ml-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Catalog
      </Link>

      {/* Detail Block */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left Side: Product Image */}
        <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 gap-2 select-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">No Product Image</span>
            </div>
          )}
        </div>

        {/* Right Side: Product Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit">
              {product.category?.name || 'Category'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mt-1 leading-tight">
              {product.productName}
            </h1>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {formatIDR(product.price)}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {product.description || 'No description provided for this premium merchandise item.'}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3 mt-auto">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-400">Stock Availability</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {product.stock > 0 ? `${product.stock} items available` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && isAuthenticated && user.role === 'CUSTOMER' && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Quantity</span>
                <div className="flex items-center gap-3 border border-slate-150 p-1.5 rounded-2xl bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || adding}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition text-slate-600 font-extrabold text-xs cursor-pointer disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-700">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                    disabled={quantity >= product.stock || adding}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition text-slate-600 font-extrabold text-xs cursor-pointer disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Error and Success Notifications */}
            {errorMsg && (
              <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-150 text-rose-600 rounded-2xl text-center mt-2">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-xs font-semibold bg-accent/25 border border-accent text-slate-700 rounded-2xl text-center mt-2">
                {successMsg}
              </div>
            )}

            {/* Add to Cart Action */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || adding}
                className={`w-full py-4 font-extrabold text-sm rounded-2xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2 select-none ${
                  product.stock <= 0
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-primary hover:bg-opacity-95 text-slate-800 border border-primary/20 active:scale-[0.99]'
                }`}
              >
                {adding ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
