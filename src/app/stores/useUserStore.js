'use client';

import { create } from 'zustand';

// Zustand store for user authentication state. Manages user data, login/logout, and fetching current user from the API.
const useUserStore = create((set) => ({
  // .1 *** VARIABLES ***
  user: null,
  isLoading: false,
  error: null,

  // .2 *** FUNCTIONS/HANDLERS ***
  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Fetches the current user from /api/users/me; handles 401 gracefully
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

  // Calls logout API and clears user state
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
