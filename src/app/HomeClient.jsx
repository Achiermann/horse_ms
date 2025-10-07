'use client';

import { useEffect, useState } from 'react';
import useEventsStore from './stores/useEventsStore';
import useUserStore from './stores/useUserStore';
import EventList from '../components/EventList';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import EventForm from '../components/EventForm';
import '../styles/HomeClient.css';

export default function HomeClient() {
  // *** VARIABLES ***
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const user = useUserStore((state) => state.user);
  const [showEventForm, setShowEventForm] = useState(false);

  // *** FUNCTIONS/HANDLERS ***
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
            <button onClick={handleAddEvent} className="home-add-btn">
              + Add Event
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
