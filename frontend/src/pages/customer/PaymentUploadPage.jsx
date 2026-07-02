import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { uploadPaymentProofApi, getMyPaymentsApi } from '../../services/paymentService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function PaymentUploadPage() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Existing payment status states
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [notes, setNotes] = useState('');
  const [existingProof, setExistingProof] = useState('');

  const backendUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api').replace('/api', '');

  const fetchPaymentStatus = async () => {
    try {
      const data = await getMyPaymentsApi();
      const match = data.find((p) => p.orderId === parseInt(orderId));
      if (match) {
        setPaymentStatus(match.paymentStatus);
        setNotes(match.notes || '');
        setExistingProof(match.proofImage);
      } else {
        setPaymentStatus(null);
        setNotes('');
        setExistingProof('');
      }
    } catch (err) {
      console.error('Failed to load my payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, [orderId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      setFile(null);
      setPreviewUrl('');
      return;
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, JPEG, and PNG images are allowed.');
      setFile(null);
      setPreviewUrl('');
      return;
    }

    setError('');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('proof', file);

    try {
      await uploadPaymentProofApi(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      setSuccess('Payment proof uploaded successfully! Admin will verify it shortly.');
      setFile(null);
      setPreviewUrl('');
      await fetchPaymentStatus();
    } catch (err) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.error || 'Failed to upload payment proof. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Upload Payment Proof
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Provide your transfer screenshot for Order #{orderId}
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        {/* Status display */}
        {paymentStatus && (
          <div className="p-5 rounded-2xl border flex flex-col gap-3 bg-slate-50/50 border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Status
              </span>
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full tracking-wider uppercase ${
                  paymentStatus === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : paymentStatus === 'REJECTED'
                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            {paymentStatus === 'REJECTED' && notes && (
              <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium">
                <span className="font-bold">Rejection reason:</span> {notes}
              </div>
            )}

            {existingProof && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Uploaded Receipt
                </span>
                <a
                  href={`${backendUrl}${existingProof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-32 aspect-square bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/50 hover:opacity-90 transition"
                >
                  <img
                    src={`${backendUrl}${existingProof}`}
                    alt="Receipt"
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Upload form */}
        {paymentStatus !== 'APPROVED' && (
          <form onSubmit={handleUpload} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                Select Receipt Image (Max 5MB, JPG/PNG)
              </label>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 text-center px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <p className="text-xs font-bold">Click to select receipt screenshot</p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or JPEG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Preview Selected Image */}
            {previewUrl && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  New Image Preview
                </span>
                <div className="w-40 aspect-square bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && uploadProgress > 0 && (
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Notifications */}
            {error && (
              <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-150 text-rose-600 rounded-2xl text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-xs font-semibold bg-accent/25 border border-accent text-slate-700 rounded-2xl text-center">
                {success}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Link
                to="/"
                className="w-1/3 py-4 text-center border border-slate-200 text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 transition cursor-pointer select-none"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={!file || uploading}
                className="w-2/3 py-4 bg-primary hover:bg-opacity-95 text-slate-800 font-extrabold text-sm rounded-2xl border border-primary/20 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 select-none disabled:opacity-50"
              >
                {uploading ? `Uploading (${uploadProgress}%)` : 'Upload Proof'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
