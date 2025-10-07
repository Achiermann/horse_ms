'use client';

import Link from 'next/link';
import useEventsStore from '../app/stores/useEventsStore';
import s from './Pagination.module.css';

export default function Pagination({ currentId }) {
  // *** VARIABLES ***
  const findPrevNext = useEventsStore((state) => state.findPrevNext);
  const { prev, next } = findPrevNext(currentId);

  return (
    <div className={s['pagination']}>
      {prev && (
        <Link href={`/events/${prev}`} className={s['pagination-btn']}>
          ← Previous Event
        </Link>
      )}
      {prev && <div className={s['pagination-spacer']} />}
      {next && (
        <Link href={`/events/${next}`} className={s['pagination-btn']}>
          Next Event →
        </Link>
      )}
    </div>
  );
}
