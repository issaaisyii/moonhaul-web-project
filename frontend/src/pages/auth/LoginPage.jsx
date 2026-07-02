import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../../components/TextInput.jsx';
import PasswordInput from '../../components/PasswordInput.jsx';
import AuthButton from '../../components/AuthButton.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final checks
    if (!email || !password || Object.keys(errors).length > 0) return;

    setLoading(true);
    setSubmitMessage('');

    // Simulate API request (Dummy handler)
    setTimeout(() => {
      setLoading(false);
      setSubmitMessage('Sign in submitted! (API integration will be implemented in the next milestone)');
    }, 1500);
  };

  // Determine if the form is valid to enable the button
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

        {submitMessage && (
          <div className="p-3 text-xs font-semibold bg-accent/20 border border-accent text-slate-700 rounded-xl text-center">
            {submitMessage}
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
