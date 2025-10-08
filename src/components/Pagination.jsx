'use client';

import Link from 'next/link';
import useEventsStore from '../app/stores/useEventsStore';
import '../styles/Pagination.css';

// Displays prev/next navigation links for event detail pages based on sorted event order.
export default function Pagination({ currentId }) {
  // .1 *** VARIABLES ***
  const findPrevNext = useEventsStore((state) => state.findPrevNext);
  const { prev, next } = findPrevNext(currentId);

  return (
    <div className="pagination">
      {prev && (
        <Link href={`/events/${prev}`} className="pagination-btn">
          ← Previous Event
        </Link>
      )}
      {prev && <div className="pagination-spacer" />}
      {next && (
        <Link href={`/events/${next}`} className="pagination-btn">
          Next Event →
        </Link>
      )}
    </div>
  );
}
