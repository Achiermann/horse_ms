'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useUserStore from './stores/useUserStore';

export default function ClientWrapper({ children }) {
  // *** VARIABLES ***
  const fetchUser = useUserStore((state) => state.fetchUser);

  // *** FUNCTIONS/HANDLERS ***
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Toaster
        position="top-right"
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
