'use client';

import useUserStore from '../app/stores/useUserStore';
import LoginForm from './LoginForm';

export default function AuthGate({ children }) {
  // *** VARIABLES ***
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: 'var(--color-text-muted)',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
}
