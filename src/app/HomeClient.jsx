'use client';

import { useEffect, useState } from 'react';
import useEventsStore from './stores/useEventsStore';
import useUserStore from './stores/useUserStore';
import EventList from '../components/EventList';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import EventForm from '../components/EventForm';
import s from '../styles/HomeClient.css';

// Main home page client component that displays the event list with search, filters, and an add button for admins.
// Hydrates events on mount and controls the EventForm modal visibility.
export default function HomeClient() {
  // .1 *** VARIABLES ***
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const user = useUserStore((state) => state.user);
  const [showEventForm, setShowEventForm] = useState(false);

  // .2 *** FUNCTIONS/HANDLERS ***
  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
  };

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-header">
          <h1>Horse Events</h1>

          {user?.isAdmin && (
            <button onClick={handleAddEvent} className="home-new-event-btn">
              <span className="home-new-event-icon">+</span>
              <span className="home-new-event-text">New event</span>
            </button>
          )}
        </div>

        <div className="home-controls">
          <SearchBar />
          <Filters />
        </div>

        <EventList />
      </div>

      {showEventForm && <EventForm onClose={handleCloseEventForm} />}
    </div>
  );
}
