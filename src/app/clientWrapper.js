'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useUserStore from './stores/useUserStore';

// Wraps the app in a client component to mount the Toaster and fetch the current user on mount.
export default function ClientWrapper({ children }) {
  // .1 *** VARIABLES ***
  const fetchUser = useUserStore((state) => state.fetchUser);

  // .2 *** FUNCTIONS/HANDLERS ***
  // Hydrates user state on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'white',
            },
          },
        }}
      />
      {children}
    </>
  );
}
