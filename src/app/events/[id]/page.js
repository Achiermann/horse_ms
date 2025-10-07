import EventDetailClient from './EventDetailClient';

export default function EventDetailPage({ params }) {
  return <EventDetailClient eventId={params.id} />;
}
