'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import useEventsStore from '../../stores/useEventsStore';
import useUserStore from '../../stores/useUserStore';
import Pagination from '../../../components/Pagination';
import '../../../styles/EventDetailClient.css';

// Event detail page with participation management. Allows users to join/leave events with optional comments.
// Admins can delete events. Fetches event data on mount and syncs with store.
export default function EventDetailClient({ eventId }) {
  // .1 *** VARIABLES ***
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const events = useEventsStore((state) => state.events);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [comment, setComment] = useState('');

  // .2 *** FUNCTIONS/HANDLERS ***
  // Fetches event details, checks participation status, and syncs to store
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          toast.error('Event not found');
          router.push('/');
          return;
        }

        const data = await response.json();
        setEvent(data.item);

        // Check if user is participating
        const participant = data.item.participants?.find((p) => p.userId === user?.id);
        setIsParticipating(!!participant);
        setComment(participant?.comment || '');

        updateEvent(eventId, data.item);
      } catch (error) {
        toast.error('Failed to load event');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user?.id, router, updateEvent]);

  // Adds current user as a participant with optional comment
  const handleParticipate = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          displayName: user.display_name || user.email,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add participant');
      }

      const data = await response.json();
      setEvent(data.item);
      updateEvent(eventId, data.item);
      setIsParticipating(true);
      toast.success('You are now participating in this event');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemoveParticipation = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/participants/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove participation');
      }

      const data = await response.json();
      setEvent(data.item);
      updateEvent(eventId, data.item);
      setIsParticipating(false);
      setComment('');
      toast.success('Removed from participants');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateComment = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/participants/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      setEvent(data.item);
      updateEvent(eventId, data.item);
      toast.success('Comment updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Admin-only: deletes the event after confirmation
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      removeEvent(eventId);
      toast.success('Event deleted');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="event-detail-loading">
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const findPrevNext = useEventsStore((state) => state.findPrevNext);
  const { prev, next } = findPrevNext(eventId);

  return (
    <div className="event-detail">
      <div className="event-detail-container">
        <div className="event-detail-nav">
          <Link href="/" className="event-detail-back">
            Go back
          </Link>
          <div className="event-detail-nav-buttons">
            {prev && (
              <Link href={`/events/${prev}`} className="event-detail-nav-btn">
                ← Previous Event
              </Link>
            )}
            {next && (
              <Link href={`/events/${next}`} className="event-detail-nav-btn">
                Next Event →
              </Link>
            )}
          </div>
        </div>
        <div className="event-detail-header">
          <h1>{event.name}</h1>
          {user?.isAdmin && (
            <button onClick={handleDelete} className="event-detail-delete">
              Delete Event
            </button>
          )}
        </div>

        <div className="event-detail-meta">
          <div className="event-detail-meta-item">
            <span className="event-detail-meta-label">📅 Date</span>
            <span className="event-detail-meta-value">{formattedDate}</span>
          </div>
          <div className="event-detail-meta-item">
            <span className="event-detail-meta-label">🕐 Time</span>
            <span className="event-detail-meta-value">{event.time}</span>
          </div>
          <div className="event-detail-meta-item">
            <span className="event-detail-meta-label">📍 Location</span>
            <span className="event-detail-meta-value">{event.location}</span>
          </div>
        </div>

        {event.info && (
          <div className="event-detail-info">
            <h2>Event Information</h2>
            <p>{event.info}</p>
          </div>
        )}

        <div className="event-detail-participants">
          <h2>Participants</h2>

          {!isParticipating && (
            <div className="event-detail-participate">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="event-detail-comment-input"
              />
              <button onClick={handleParticipate} className="event-detail-participate-btn">
                Participate
              </button>
            </div>
          )}

          {isParticipating && (
            <div className="event-detail-participate">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="event-detail-comment-input"
              />
              <button onClick={handleUpdateComment} className="event-detail-update-btn">
                Update Comment
              </button>
              <button onClick={handleRemoveParticipation} className="event-detail-remove-btn">
                Remove Participation
              </button>
            </div>
          )}

          <div className="event-detail-participants-list">
            {event.participants && event.participants.length > 0 ? (
              event.participants.map((participant, index) => (
                <div key={index} className="event-detail-participant">
                  <div className="event-detail-participant-name">{participant.displayName}</div>
                  {participant.comment && (
                    <div className="event-detail-participant-comment">{participant.comment}</div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No participants yet.</p>
            )}
          </div>
        </div>

        <Pagination currentId={eventId} />
      </div>
    </div>
  );
}
