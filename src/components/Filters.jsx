'use client';

import useEventsStore from '../app/stores/useEventsStore';
import '../styles/Filters.css';

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
    <div className="filters">
      <div className="filters-inputs">
        <div className="filters-field">
          <label htmlFor="start-date" className="filters-label">
            From
          </label>
          <input
            type="date"
            id="start-date"
            value={filters.startDate || ''}
            onChange={handleStartDateChange}
            className="filters-input"
          />
        </div>

        <div className="filters-field">
          <label htmlFor="end-date" className="filters-label">
            To
          </label>
          <input
            type="date"
            id="end-date"
            value={filters.endDate || ''}
            onChange={handleEndDateChange}
            className="filters-input"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={handleClearFilters} className="filters-clear">
          Clear filters
        </button>
      )}
    </div>
  );
}
