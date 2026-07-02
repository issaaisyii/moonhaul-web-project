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
      setSuccess('Order placed successfully! Redirecting to shop catalog...');
      
      // Delay to let the user see the success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
          <Link
            to="/cart"
            disabled={checkingOut}
            className="w-full sm:w-1/3 py-4 text-center border border-slate-200 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 transition cursor-pointer select-none"
          >
            Back to Cart
          </Link>
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
