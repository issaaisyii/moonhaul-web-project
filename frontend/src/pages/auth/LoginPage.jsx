import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import TextInput from '../../components/TextInput.jsx';
import PasswordInput from '../../components/PasswordInput.jsx';
import AuthButton from '../../components/AuthButton.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Real-time validation handlers
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!val) {
      setErrors((prev) => ({ ...prev, email: 'Email is required.' }));
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.email;
        return copy;
      });
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (!val) {
      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
    } else if (val.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.password;
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || Object.keys(errors).length > 0) return;

    setLoading(true);
    setSubmitError('');

    try {
      const data = await login(email, password);
      // Success redirection: CUSTOMER -> /dashboard, ADMIN -> /admin
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.error || 'Failed to sign in. Please check your credentials.';
      setSubmitError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = !email || !password || Object.keys(errors).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Welcome Back!</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Please enter your credentials to login</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          placeholder="example@email.com"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          placeholder="••••••••"
          required
        />

        {submitError && (
          <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-center">
            {submitError}
          </div>
        )}

        <div className="mt-2">
          <AuthButton type="submit" disabled={isFormInvalid} loading={loading}>
            Sign In
          </AuthButton>
        </div>
      </form>

      <div className="text-center text-xs font-semibold text-slate-400 mt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-600 hover:text-purple-700 transition">
          Create Account
        </Link>
      </div>
    </div>
  );
}
