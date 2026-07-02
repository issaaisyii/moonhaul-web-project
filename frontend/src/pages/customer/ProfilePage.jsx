import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getCustomerDashboardApi } from '../../services/dashboardService.js';
import LoadingScreen from '../../components/LoadingScreen.jsx';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [nameInput, setNameInput] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getCustomerDashboardApi();
      setStats(data);
      setNameInput(data.name || user?.name || '');
    } catch (err) {
      console.error('Failed to load profile stats:', err);
      setError('Could not retrieve account statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const trimmedName = nameInput.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50) {
      setFormError('Full name must be between 2 and 50 characters.');
      return;
    }

    const changingPassword = oldPassword || newPassword || confirmPassword;
    if (changingPassword) {
      if (!oldPassword) {
        setFormError('Please enter your current password to set a new one.');
        return;
      }
      if (newPassword.length < 8) {
        setFormError('New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormError('New password and confirm password do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      await updateProfile(
        trimmedName,
        changingPassword ? oldPassword : null,
        changingPassword ? newPassword : null
      );
      setFormSuccess('Profile updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchStats();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setFormError(err.response?.data?.error || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto my-4 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Account Profile</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Manage your K-Pop account credentials and spending logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-slate-800 border border-primary/10 select-none">
              <span className="text-3xl font-black">{nameInput.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-850">{nameInput}</h2>
              <span className="text-xs text-slate-400 font-semibold">{user?.email}</span>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-5 flex flex-col gap-3.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="font-bold text-slate-400">Join Date</span>
              <span className="font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-400">Total Pre-Orders</span>
              <span className="font-mono font-bold text-slate-850">{stats?.totalOrdersCount || 0} orders</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-400">Total Expenditure</span>
              <span className="font-mono font-bold text-slate-850">{formatIDR(stats?.totalSpending)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-5">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide border-b border-slate-50 pb-3">
            Edit Credentials
          </h3>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                required
                disabled={saving}
              />
            </div>

            <div className="border-t border-slate-100 my-2 pt-4 flex flex-col gap-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                Change Password (Optional)
              </span>

              {/* Old Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                  disabled={saving}
                />
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                    disabled={saving}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Match new password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            {formError && (
              <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-150 text-rose-600 rounded-2xl text-center">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 text-xs font-semibold bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-2xl text-center">
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 py-4 bg-primary hover:bg-opacity-95 text-slate-800 font-extrabold text-sm rounded-2xl border border-primary/20 transition shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
