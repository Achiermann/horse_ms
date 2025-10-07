'use client';

import useEventsStore from '../app/stores/useEventsStore';
import EventListItem from './EventListItem';
import '../styles/EventList.css';

export default function EventList() {
  // *** VARIABLES ***
  const getSortedEvents = useEventsStore((state) => state.getSortedEvents);
  const isLoading = useEventsStore((state) => state.isLoading);
  const events = getSortedEvents();

  return (
    <div className="event-list">
      {isLoading && <div className="event-list-loading">Loading events...</div>}

      {!isLoading && events.length === 0 && (
        <div className="event-list-empty">
          <p>No events found.</p>
          <p className="text-muted text-small">Try adjusting your search or filters.</p>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="event-list-items">
          {events.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
