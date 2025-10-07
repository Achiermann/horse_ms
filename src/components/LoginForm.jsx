'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../app/stores/useUserStore';
import s from './LoginForm.module.css';

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
    <div className={s['login-form-overlay']}>
      <div className={s['login-form']}>
        <h2 className={s['login-form-title']}>Welcome to Horse-MS</h2>
        <p className={s['login-form-subtitle']}>Please sign in to continue</p>

        <form onSubmit={handleSubmit} className={s['login-form-body']}>
          <div className={s['login-form-field']}>
            <label htmlFor="email" className={s['login-form-label']}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={s['login-form-input']}
              required
              autoFocus
            />
          </div>

          <div className={s['login-form-field']}>
            <label htmlFor="password" className={s['login-form-label']}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={s['login-form-input']}
              required
            />
          </div>

          <div className={s['login-form-checkbox']}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={s['login-form-checkbox-input']}
            />
            <label htmlFor="rememberMe" className={s['login-form-checkbox-label']}>
              Remember me
            </label>
          </div>

          <button type="submit" className={s['login-form-submit']} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
