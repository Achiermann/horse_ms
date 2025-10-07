'use client';

import { create } from 'zustand';

const useUserStore = create((set) => ({
  // *** VARIABLES ***
  user: null,
  isLoading: false,
  error: null,

  // *** FUNCTIONS/HANDLERS ***
  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  fetchUser: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/users/me');

      if (!response.ok) {
        if (response.status === 401) {
          set({ user: null, isLoading: false });
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false, user: null });
    }
  },

  logout: async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' });
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
