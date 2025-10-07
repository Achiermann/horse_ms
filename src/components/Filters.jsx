'use client';

import useEventsStore from '../app/stores/useEventsStore';
import s from './Filters.module.css';

export default function Filters() {
  // *** VARIABLES ***
  const filters = useEventsStore((state) => state.filters);
  const setFilters = useEventsStore((state) => state.setFilters);
  const clearFilters = useEventsStore((state) => state.clearFilters);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);

  // *** FUNCTIONS/HANDLERS ***
  const handleStartDateChange = (e) => {
    setFilters({ startDate: e.target.value || null });
    fetchEvents();
  };

  const handleEndDateChange = (e) => {
    setFilters({ endDate: e.target.value || null });
    fetchEvents();
  };

  const handleClearFilters = () => {
    clearFilters();
    fetchEvents();
  };

  const hasActiveFilters = filters.startDate || filters.endDate;

  return (
    <div className={s['filters']}>
      <div className={s['filters-inputs']}>
        <div className={s['filters-field']}>
          <label htmlFor="start-date" className={s['filters-label']}>
            From
          </label>
          <input
            type="date"
            id="start-date"
            value={filters.startDate || ''}
            onChange={handleStartDateChange}
            className={s['filters-input']}
          />
        </div>

        <div className={s['filters-field']}>
          <label htmlFor="end-date" className={s['filters-label']}>
            To
          </label>
          <input
            type="date"
            id="end-date"
            value={filters.endDate || ''}
            onChange={handleEndDateChange}
            className={s['filters-input']}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={handleClearFilters} className={s['filters-clear']}>
          Clear filters
        </button>
      )}
    </div>
  );
}
