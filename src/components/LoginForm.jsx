'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../app/stores/useUserStore';
import '../styles/LoginForm.css';

// Auth form that toggles between login and signup modes.
// Validates inputs, calls the appropriate API endpoint, and hydrates the user store on success.
export default function LoginForm() {
  // .1 *** VARIABLES ***
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // .2 *** FUNCTIONS/HANDLERS ***
  // Handles both login and signup based on isSignup state, validates inputs, and updates user store
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    if (isSignup && !displayName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isSignup ? '/api/users/signup' : '/api/users/login';
      const body = isSignup ? { email, password, displayName } : { email, password, rememberMe };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `${isSignup ? 'Signup' : 'Login'} failed`);
      }

      toast.success(isSignup ? 'Account created successfully!' : 'Login successful');
      await fetchUser();
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <div className="login-form-overlay">
      <div className="login-form">
        <h2 className="login-form-title">Welcome to Horse-MS</h2>
        <p className="login-form-subtitle">
          {isSignup ? 'Create your account' : 'Please sign in to continue'}
        </p>

        <form onSubmit={handleSubmit} className="login-form-body">
          {isSignup && (
            <div className="login-form-field">
              <label htmlFor="displayName" className="login-form-label">
                Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="login-form-input"
                required
                autoFocus
              />
            </div>
          )}

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
              autoFocus={!isSignup}
              suppressHydrationWarning
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">
              Password {isSignup && <span className="text-muted">(min. 6 characters)</span>}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-form-input"
              required
              minLength={6}
              suppressHydrationWarning
            />
          </div>

          {!isSignup && (
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
          )}

          <button type="submit" className="login-form-submit" disabled={isSubmitting}>
            {isSubmitting
              ? isSignup
                ? 'Creating account...'
                : 'Signing in...'
              : isSignup
                ? 'Create Account'
                : 'Sign In'}
          </button>

          <div className="login-form-toggle">
            <button type="button" onClick={toggleMode} className="login-form-toggle-btn">
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
