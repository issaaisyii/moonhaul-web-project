import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCartApi } from '../../services/cartService.js';
import { checkoutApi } from '../../services/checkoutService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Successful order state
  const [placedOrder, setPlacedOrder] = useState(null);

  const fetchCartForCheckout = async () => {
    setError('');
    try {
      const data = await getCartApi();
      setCart(data);
      if (!data.items || data.items.length === 0) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Checkout cart load failed:', err);
      setError('Failed to retrieve cart details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartForCheckout();
  }, []);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError('');
    setSuccess('');

    try {
      const result = await checkoutApi();
      setSuccess('Order placed successfully!');
      setPlacedOrder(result.order);
    } catch (err) {
      console.error('Checkout process failed:', err);
      const msg = err.response?.data?.error || 'Failed to complete checkout. Please check stock availability.';
      setError(msg);
      setCheckingOut(false);
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

  // Render Successful checkout screen
  if (placedOrder) {
    return (
      <div className="flex flex-col gap-6 text-left max-w-lg mx-auto my-6 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col gap-6 text-center items-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-slate-800">Order Placed Successfully!</h2>
            <p className="text-xs font-semibold text-slate-400">Order #{placedOrder.id}</p>
          </div>

          {/* Payment Details */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200/60 text-sm">
              <span className="font-bold text-slate-400">Total Amount to Pay</span>
              <span className="font-black text-slate-800 text-base">{formatIDR(placedOrder.totalAmount)}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Transfer Details
              </span>
              <div className="text-xs font-semibold text-slate-700 flex flex-col gap-1">
                <p><span className="font-bold text-slate-400">Bank Name:</span> Moon Bank</p>
                <p><span className="font-bold text-slate-400">Account Number:</span> 123-456-7890</p>
                <p><span className="font-bold text-slate-400">Account Name:</span> MoonHaul Shop</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link
              to={`/payment-upload/${placedOrder.id}`}
              className="w-full py-4 bg-primary hover:bg-opacity-95 text-slate-800 font-extrabold text-sm rounded-2xl border border-primary/20 transition shadow-sm active:scale-[0.99] flex items-center justify-center"
            >
              Upload Payment Proof
            </Link>
            <Link
              to="/"
              className="w-full py-3.5 text-center border border-slate-200 text-slate-500 font-bold text-xs rounded-2xl hover:bg-slate-50 transition"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Checkout Overview
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Review your items and place order snapshot
        </p>
      </div>

      {/* Checkout details card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Order Merchandise</h3>

        {/* Item List */}
        <div className="flex flex-col divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between gap-4 items-center">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-bold text-slate-800 text-sm truncate">
                  {item.product.productName}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Quantity: {item.quantity} x {formatIDR(item.product.price)}
                </span>
              </div>
              <span className="text-sm font-black text-slate-700 shrink-0">
                {formatIDR(parseFloat(item.product.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-slate-150 pt-6 flex flex-col gap-3">
          <div className="flex justify-between text-sm font-bold text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-600">{formatIDR(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-400">
            <span>Shipping Cost</span>
            <span className="text-emerald-500 font-black">Free Shipping (Promo)</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4 items-center">
            <span className="font-extrabold text-slate-800 text-base">Total Pay</span>
            <span className="text-xl font-black text-slate-900">{formatIDR(totalAmount)}</span>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-xs font-semibold bg-accent/25 border border-accent text-slate-700 rounded-2xl text-center">
            {success}
          </div>
        )}

        {/* Action button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/cart')}
            disabled={checkingOut}
            className="w-full sm:w-1/3 py-4 text-center border border-slate-200 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 transition cursor-pointer select-none"
          >
            Back to Cart
          </button>
          <button
            onClick={handleCheckout}
            disabled={checkingOut || !!success}
            className="w-full sm:w-2/3 py-4 bg-primary hover:bg-opacity-95 text-slate-800 font-extrabold text-sm rounded-2xl border border-primary/20 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 select-none disabled:opacity-50"
          >
            {checkingOut ? 'Processing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
