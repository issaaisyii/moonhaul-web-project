import React, { useState, useEffect } from 'react';
import { getPaymentsApi, approvePaymentApi, rejectPaymentApi } from '../../services/paymentService.js';

export default function PaymentVerificationPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rejection modal control states
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectNotesInput, setRejectNotesInput] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // Zoom preview modal state
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const backendUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api').replace('/api', '');

  const fetchPayments = async () => {
    setError('');
    try {
      const data = await getPaymentsApi();
      setPayments(data);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError('Could not retrieve payment records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (paymentId) => {
    if (!window.confirm('Are you sure you want to approve this payment proof?')) return;

    setLoading(true);
    try {
      await approvePaymentApi(paymentId);
      await fetchPayments();
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Failed to approve payment.');
      setLoading(false);
    }
  };

  const handleOpenRejectModal = (payment) => {
    setRejectTarget(payment);
    setRejectNotesInput('');
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectTarget) return;

    setSubmittingReject(true);
    try {
      await rejectPaymentApi(rejectTarget.id, rejectNotesInput.trim() || 'Proof image is invalid.');
      setRejectTarget(null);
      await fetchPayments();
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Failed to reject payment.');
    } finally {
      setSubmittingReject(false);
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Payment Verification</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Review manual transfer screenshots uploaded by customers
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading payment receipts...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-rose-400 font-bold text-sm">{error}</span>
            <button
              onClick={fetchPayments}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition border border-slate-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-2">
            <span className="text-slate-400 font-bold text-sm">No payment records found</span>
            <p className="text-slate-500 text-xs">Customer proof uploads will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-950/50 border-b border-slate-850">
                <tr>
                  <th scope="col" className="px-6 py-4">Receipt</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Order #</th>
                  <th scope="col" className="px-6 py-4">Total Amount</th>
                  <th scope="col" className="px-6 py-4">Uploaded At</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/30 transition">
                    {/* Zoom preview trigger */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPreviewImageUrl(`${backendUrl}${p.proofImage}`)}
                        className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center cursor-zoom-in hover:opacity-90 transition"
                      >
                        <img
                          src={`${backendUrl}${p.proofImage}`}
                          alt="Proof"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{p.order?.user?.name || 'User'}</span>
                        <span className="text-xs text-slate-500">{p.order?.user?.email || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{p.orderId}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {formatIDR(p.order?.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(p.uploadedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full tracking-wider uppercase text-[10px] ${
                          p.paymentStatus === 'APPROVED'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/60'
                            : p.paymentStatus === 'REJECTED'
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-900/60'
                            : 'bg-amber-950/40 text-amber-400 border border-amber-900/60'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3 items-center min-h-[88px]">
                      {p.paymentStatus === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(p)}
                            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Notes Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Reject Payment proof</h3>
              <p className="text-xs text-slate-400 mt-1">Provide feedback notes on why this receipt was declined.</p>
            </div>

            <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Feedback Notes
                </label>
                <textarea
                  value={rejectNotesInput}
                  onChange={(e) => setRejectNotesInput(e.target.value)}
                  placeholder="e.g. Receipt image blurry or transfer amount does not match."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-950/20 transition-all duration-200 h-24 resize-none"
                  required
                  disabled={submittingReject}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  disabled={submittingReject}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-rose-900/20 cursor-pointer disabled:opacity-50"
                >
                  {submittingReject ? 'Rejecting...' : 'Reject Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zoom Image Preview Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl('')}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
            <img
              src={previewImageUrl}
              alt="Zoomed Receipt"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
