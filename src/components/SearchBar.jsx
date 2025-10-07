'use client';

import { useEffect, useState } from 'react';
import useEventsStore from '../app/stores/useEventsStore';
import s from './SearchBar.module.css';

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
    <div className={s['search-bar']}>
      <input
        type="text"
        value={localSearch}
        onChange={handleChange}
        placeholder="Search events by name or location..."
        className={s['search-bar-input']}
      />
      {localSearch && (
        <button onClick={handleClear} className={s['search-bar-clear']} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}
