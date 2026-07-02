import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartApi, updateCartItemApi, deleteCartItemApi, clearCartApi } from '../../services/cartService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const fetchCart = async () => {
    setError('');
    try {
      const data = await getCartApi();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to retrieve your shopping cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, currentQty, amount, maxStock) => {
    const newQty = currentQty + amount;
    if (newQty < 1 || newQty > maxStock) return;

    setUpdatingItemId(itemId);
    try {
      await updateCartItemApi(itemId, newQty);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      alert(err.response?.data?.error || 'Failed to update item quantity.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    setUpdatingItemId(itemId);
    try {
      await deleteCartItemApi(itemId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to remove item from cart.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to empty your cart?')) return;

    setLoading(true);
    try {
      await clearCartApi();
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      alert('Failed to clear cart.');
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/50 border border-rose-100 rounded-3xl flex flex-col items-center gap-4">
        <span className="text-rose-500 font-bold text-sm">{error}</span>
        <button
          onClick={fetchCart}
          className="px-5 py-2.5 bg-rose-500 text-white font-semibold text-xs rounded-full hover:bg-rose-600 transition shadow-sm cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto my-12 p-16 text-center bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-extrabold text-slate-800 text-lg">Your cart is empty</h3>
          <p className="text-slate-400 text-xs font-semibold">
            Looks like you haven't added any merchandise to your cart yet.
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 px-6 py-3 bg-purple-600 hover:bg-purple-750 text-white font-bold text-sm rounded-full transition shadow-sm"
        >
          Browse Merchandise
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center relative overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-slate-300 uppercase">No Img</span>
                )}
              </div>

              {/* Product details */}
              <div className="flex-grow flex flex-col gap-1 pr-6 min-w-0">
                <span className="text-[9px] font-extrabold tracking-widest uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
                  {item.product.category?.name || 'Item'}
                </span>
                <h3 className="font-bold text-slate-800 text-sm truncate">
                  {item.product.productName}
                </h3>
                <span className="text-xs font-bold text-slate-900 mt-1">
                  {formatIDR(item.product.price)}
                </span>
              </div>

              {/* Controls: Qty Selector and Subtotal */}
              <div className="flex flex-col md:flex-row items-end md:items-center gap-4 shrink-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2.5 border border-slate-150 p-1 rounded-xl bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, item.product.stock)}
                    disabled={item.quantity <= 1 || updatingItemId === item.id}
                    className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition text-slate-600 font-extrabold text-xs cursor-pointer disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, item.product.stock)}
                    disabled={item.quantity >= item.product.stock || updatingItemId === item.id}
                    className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition text-slate-600 font-extrabold text-xs cursor-pointer disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-black text-slate-800 w-24 text-right">
                  {formatIDR(parseFloat(item.product.price) * item.quantity)}
                </span>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={updatingItemId === item.id}
                  className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button
            onClick={handleClearCart}
            className="w-fit text-xs font-bold text-slate-400 hover:text-rose-500 transition ml-2 cursor-pointer mt-1"
          >
            Clear All Items
          </button>
        </div>

        {/* Right Side: Order Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6 h-fit">
          <h3 className="font-extrabold text-slate-800 text-base">Order Summary</h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-slate-400">Total Items</span>
              <span className="font-bold text-slate-700">
                {items.reduce((sum, item) => sum + item.quantity, 0)} pcs
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-400">Est. Total Amount</span>
              <span className="text-lg font-black text-slate-900">{formatIDR(totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-primary hover:bg-opacity-95 text-slate-800 font-extrabold text-sm rounded-2xl border border-primary/20 transition shadow-sm active:scale-[0.99] cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
