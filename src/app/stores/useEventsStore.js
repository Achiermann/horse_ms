'use client';

import { create } from 'zustand';

// Zustand store for events. Manages event list, search, date filters, and provides sorting/pagination helpers.
const useEventsStore = create((set, get) => ({
  // .1 *** VARIABLES ***
  events: [],
  search: '',
  filters: {
    startDate: null,
    endDate: null,
  },
  isLoading: false,
  error: null,

  // .2 *** FUNCTIONS/HANDLERS ***
  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt)),
    })),

  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((evt) => evt.id !== id),
    })),

  setSearch: (search) => set({ search }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Returns events filtered by search and date range, sorted by date/time/name
  getSortedEvents: () => {
    const { events, search, filters } = get();

    let filtered = [...events];

    // Apply search filter (case-insensitive on name + location)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (evt) =>
          evt.name.toLowerCase().includes(searchLower) ||
          evt.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filters
    if (filters.startDate) {
      filtered = filtered.filter((evt) => evt.date >= filters.startDate);
    }

    if (filters.endDate) {
      filtered = filtered.filter((evt) => evt.date <= filters.endDate);
    }

    // Sort: date ASC, time ASC, name ASC, id ASC
    return filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date < b.date ? -1 : 1;
      }
      if (a.time !== b.time) {
        return a.time < b.time ? -1 : 1;
      }
      if (a.name !== b.name) {
        return a.name.localeCompare(b.name);
      }
      return a.id.localeCompare(b.id);
    });
  },

  getSortedIds: () => {
    return get()
      .getSortedEvents()
      .map((evt) => evt.id);
  },

  // Given an event ID, returns the prev/next IDs in sorted order (for pagination)
  // Wraps around: if at first event, prev goes to last; if at last event, next goes to first
  findPrevNext: (id) => {
    const sortedIds = get().getSortedIds();
    const currentIndex = sortedIds.indexOf(id);

    if (currentIndex === -1 || sortedIds.length === 0) {
      return { prev: null, next: null };
    }

    return {
      prev: currentIndex > 0 ? sortedIds[currentIndex - 1] : sortedIds[sortedIds.length - 1],
      next: currentIndex < sortedIds.length - 1 ? sortedIds[currentIndex + 1] : sortedIds[0],
    };
  },

  // Fetches events from API with current search and filter params
  fetchEvents: async () => {
    const { search, filters } = get();
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (filters.startDate) params.append('from', filters.startDate);
      if (filters.endDate) params.append('to', filters.endDate);

      const response = await fetch(`/api/events?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      set({ events: data.items || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearFilters: () =>
    set({
      search: '',
      filters: { startDate: null, endDate: null },
    }),
}));

export default useEventsStore;
