'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useEventsStore from '../app/stores/useEventsStore';
import s from './EventForm.module.css';

export default function EventForm({ onClose, initialEvent = null }) {
  // *** VARIABLES ***
  const addEvent = useEventsStore((state) => state.addEvent);
  const updateEvent = useEventsStore((state) => state.updateEvent);
  const [formData, setFormData] = useState({
    name: initialEvent?.name || '',
    location: initialEvent?.location || '',
    date: initialEvent?.date || '',
    time: initialEvent?.time || '',
    info: initialEvent?.info || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // *** FUNCTIONS/HANDLERS ***
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Event name is required');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Location is required');
      return;
    }

    if (!formData.date) {
      toast.error('Date is required');
      return;
    }

    if (!formData.time) {
      toast.error('Time is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = initialEvent ? `/api/events/${initialEvent.id}` : '/api/events';

      const method = initialEvent ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to save event');
      }

      const data = await response.json();

      if (initialEvent) {
        updateEvent(initialEvent.id, data.item);
        toast.success('Event updated successfully');
      } else {
        addEvent(data.item);
        toast.success('Event created successfully');
      }

      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={s['event-form-overlay']} onClick={onClose}>
      <div className={s['event-form']} onClick={(e) => e.stopPropagation()}>
        <div className={s['event-form-header']}>
          <h2>{initialEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className={s['event-form-close']} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={s['event-form-body']}>
          <div className={s['event-form-field']}>
            <label htmlFor="name" className={s['event-form-label']}>
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={s['event-form-input']}
              required
            />
          </div>

          <div className={s['event-form-field']}>
            <label htmlFor="location" className={s['event-form-label']}>
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={s['event-form-input']}
              required
            />
          </div>

          <div className={s['event-form-row']}>
            <div className={s['event-form-field']}>
              <label htmlFor="date" className={s['event-form-label']}>
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={s['event-form-input']}
                required
              />
            </div>

            <div className={s['event-form-field']}>
              <label htmlFor="time" className={s['event-form-label']}>
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={s['event-form-input']}
                required
              />
            </div>
          </div>

          <div className={s['event-form-field']}>
            <label htmlFor="info" className={s['event-form-label']}>
              Additional Information
            </label>
            <textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChange}
              className={s['event-form-textarea']}
              rows="4"
              placeholder="Add any additional details about the event..."
            />
          </div>

          <div className={s['event-form-actions']}>
            <button
              type="button"
              onClick={onClose}
              className={s['event-form-cancel']}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className={s['event-form-submit']} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
