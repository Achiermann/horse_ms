'use client';

import { useEffect, useState } from 'react';
import useEventsStore from '../app/stores/useEventsStore';
import '../styles/SearchBar.css';

export default function SearchBar() {
  // *** VARIABLES ***
  const search = useEventsStore((state) => state.search);
  const setSearch = useEventsStore((state) => state.setSearch);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const [localSearch, setLocalSearch] = useState(search);

  // *** FUNCTIONS/HANDLERS ***
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
