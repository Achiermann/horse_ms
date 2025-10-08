'use client';

import { useEffect, useState } from 'react';
import useEventsStore from '../app/stores/useEventsStore';
import '../styles/SearchBar.css';

// Search input with 250ms debounce that filters events by name or location.
// Uses local state to prevent unnecessary re-renders and API calls.
export default function SearchBar() {
  // .1 *** VARIABLES ***
  const search = useEventsStore((state) => state.search);
  const setSearch = useEventsStore((state) => state.setSearch);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const [localSearch, setLocalSearch] = useState(search);

  // .2 *** FUNCTIONS/HANDLERS ***
  // Debounced search: waits 250ms after typing stops before triggering fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
      fetchEvents();
    }, 250); // 250ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, setSearch, fetchEvents]);

  const handleChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleClear = () => {
    setLocalSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={localSearch}
        onChange={handleChange}
        placeholder="Search events by name or location..."
        className="search-bar-input"
      />
      {localSearch && (
        <button onClick={handleClear} className="search-bar-clear" aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}
