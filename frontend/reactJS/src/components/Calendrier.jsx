import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = ({ events = [] }) => {
  // Convertir les événements dans le format requis par FullCalendar
  const formattedEvents = events.map(event => ({
    title: event.message || 'Publication',
    date: event.scheduleDate 
      ? new Date(event.scheduleDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  }));

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          // Événements par défaut
          { title: "Exemple", date: "2025-03-30" },
          ...formattedEvents
        ]}
      />
    </div>
  );
};

export default Calendar;