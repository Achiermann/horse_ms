import EventDetailClient from './EventDetailClient';

// Server component for event detail page. Passes dynamic eventId to the client component.
export default function EventDetailPage({ params }) {
  return <EventDetailClient eventId={params.id} />;
}
