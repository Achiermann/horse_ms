'use client';

import useUserStore from '../app/stores/useUserStore';
import LoginForm from './LoginForm';
import '../styles/AuthGate.module.css';

// Wrapper that blocks rendering of children until the user is authenticated. Shows LoginForm if no user.
export default function AuthGate({ children }) {
  // .1 *** VARIABLES ***
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="auth-gate-loading">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
}
