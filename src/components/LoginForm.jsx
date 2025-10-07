'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../app/stores/useUserStore';
import '../styles/LoginForm.css';

export default function LoginForm() {
  // *** VARIABLES ***
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // *** FUNCTIONS/HANDLERS ***
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Login failed');
      }

      toast.success('Login successful');
      await fetchUser();
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-overlay">
      <div className="login-form">
        <h2 className="login-form-title">Welcome to Horse-MS</h2>
        <p className="login-form-subtitle">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="login-form-field">
            <label htmlFor="email" className="login-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-form-input"
              required
              autoFocus
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="login-form-checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="login-form-checkbox-input"
            />
            <label htmlFor="rememberMe" className="login-form-checkbox-label">
              Remember me
            </label>
          </div>

          <button type="submit" className="login-form-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
