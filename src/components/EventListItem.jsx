'use client';

import Link from 'next/link';
import '../styles/EventListItem.css';

export default function EventListItem({ event }) {
  // *** VARIABLES ***
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/events/${event.id}`} className="event-list-item">
      <div className="event-list-item-date">
        <div className="event-list-item-date-day">{new Date(event.date).getDate()}</div>
        <div className="event-list-item-date-month">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </div>
      </div>

      <div className="event-list-item-content">
        <h3 className="event-list-item-name">{event.name}</h3>
        <div className="event-list-item-meta">
          <span className="event-list-item-location">{event.location}</span>
          <span className="event-list-item-time">{event.time}</span>
          {event.participants && event.participants.length > 0 && (
            <span className="event-list-item-participants">
              {event.participants.length} participant{event.participants.length !== 1 && 's'}
            </span>
          )}
        </div>
      </div>

      <div className="event-list-item-arrow">→</div>
    </Link>
  );
}
