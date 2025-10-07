'use client';

import Link from 'next/link';
import s from './EventListItem.module.css';

export default function EventListItem({ event }) {
  // *** VARIABLES ***
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/events/${event.id}`} className={s['event-list-item']}>
      <div className={s['event-list-item-date']}>
        <div className={s['event-list-item-date-day']}>{new Date(event.date).getDate()}</div>
        <div className={s['event-list-item-date-month']}>
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </div>
      </div>

      <div className={s['event-list-item-content']}>
        <h3 className={s['event-list-item-name']}>{event.name}</h3>
        <div className={s['event-list-item-meta']}>
          <span className={s['event-list-item-location']}>{event.location}</span>
          <span className={s['event-list-item-time']}>{event.time}</span>
          {event.participants && event.participants.length > 0 && (
            <span className={s['event-list-item-participants']}>
              {event.participants.length} participant{event.participants.length !== 1 && 's'}
            </span>
          )}
        </div>
      </div>

      <div className={s['event-list-item-arrow']}>→</div>
    </Link>
  );
}
