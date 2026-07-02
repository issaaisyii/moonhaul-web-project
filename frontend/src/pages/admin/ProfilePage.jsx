import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  // Form states
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

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
      setFormSuccess('Admin profile updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update admin profile:', err);
      setFormError(err.response?.data?.error || 'Failed to update profile details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left text-slate-100 my-4 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Profile</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Manage your administrative credentials and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Summary Card */}
        <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 bg-purple-950/40 border border-purple-800 rounded-full flex items-center justify-center text-purple-400 select-none">
              <span className="text-3xl font-black">{nameInput.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-white">{nameInput}</h2>
              <span className="text-xs text-slate-500 font-semibold">{user?.email}</span>
            </div>
            <span className="px-3 py-1 bg-purple-950/40 text-purple-400 border border-purple-900 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          <div className="border-t border-slate-850 pt-5 flex justify-between text-xs">
            <span className="font-bold text-slate-500">Joined Date</span>
            <span className="font-semibold text-slate-300">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : '-'}
            </span>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-850 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-5">
          <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-850 pb-3">
            Edit Credentials
          </h3>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                required
                disabled={saving}
              />
            </div>

            <div className="border-t border-slate-850 my-2 pt-4 flex flex-col gap-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">
                Change Password (Optional)
              </span>

              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                  disabled={saving}
                />
              </div>

              {/* Password change inputs */}
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
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
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
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Notifications */}
            {formError && (
              <div className="p-3 text-xs font-semibold bg-rose-950/40 border border-rose-900/60 text-rose-400 rounded-2xl text-center">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 text-xs font-semibold bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 rounded-2xl text-center">
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl border border-purple-800 transition shadow-lg shadow-purple-900/20 active:scale-[0.99] cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
