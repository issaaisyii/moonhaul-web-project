import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from '../../components/TextInput.jsx';
import PasswordInput from '../../components/PasswordInput.jsx';
import AuthButton from '../../components/AuthButton.jsx';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Validation handlers
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!val) {
      setErrors((prev) => ({ ...prev, name: 'Full Name is required.' }));
    } else if (val.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: 'Full Name must be at least 2 characters.' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.name;
        return copy;
      });
    }
  };

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

    // Cross-validate with confirm password
    if (confirmPassword && val !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else if (confirmPassword && val === confirmPassword) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.confirmPassword;
        return copy;
      });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (!val) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Confirm Password is required.' }));
    } else if (val !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.confirmPassword;
        return copy;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final check
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      Object.keys(errors).length > 0
    ) {
      return;
    }

    setLoading(true);
    setSubmitMessage('');

    // Simulate API request (Dummy handler)
    setTimeout(() => {
      setLoading(false);
      setSubmitMessage('Registration submitted! (API integration will be implemented in the next milestone)');
    }, 1500);
  };

  // Enable/disable submit button
  const isFormInvalid =
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    Object.keys(errors).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Create Account</h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">Join MoonHaul pre-order system</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextInput
          label="Full Name"
          name="name"
          value={name}
          onChange={handleNameChange}
          error={errors.name}
          placeholder="John Doe"
          required
        />

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

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
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
            Sign Up
          </AuthButton>
        </div>
      </form>

      <div className="text-center text-xs font-semibold text-slate-400 mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 hover:text-purple-700 transition">
          Sign In
        </Link>
      </div>
    </div>
  );
}
