'use client';

import useUserStore from '../app/stores/useUserStore';
import LoginForm from './LoginForm';
import '../styles/AuthGate.css';

export default function AuthGate({ children }) {
  // *** VARIABLES ***
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
