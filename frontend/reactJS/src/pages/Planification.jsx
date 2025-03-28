import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BarreHaut from '../components/BarreHaut';

// Configuration du localizer pour les dates en français
const localizer = momentLocalizer(moment);

const Planification = () => {
  // États pour gérer les événements (publications)
  const [events, setEvents] = useState([
    {
      title: 'Publication Instagram',
      start: new Date(2024, 3, 15, 10, 0),
      end: new Date(2024, 3, 15, 12, 0),
      platform: 'Instagram'
    },
    {
      title: 'Publication Twitter',
      start: new Date(2024, 3, 20, 14, 0),
      end: new Date(2024, 3, 20, 15, 0),
      platform: 'Twitter'
    }
  ]);

  // Gestionnaire pour ajouter un nouvel événement
  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Nom de la publication');
    const platform = window.prompt('Plateforme (Instagram, Twitter, etc.)');
    
    if (title && platform) {
      const newEvent = { 
        title, 
        start, 
        end, 
        platform 
      };
      setEvents([...events, newEvent]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <BarreHaut />
      <div className="pt-20 p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#FF0035]">
          Calendrier de Publications
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectSlot={handleSelect}
            selectable
          />
        </div>
      </div>
    </div>
  );
};

export default Planification;