import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = ({ events = [] }) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([
    { title: "Exemple d'événement", date: "2025-03-30" },
    { title: "Réunion", date: "2025-03-31" },
    ...events
  ]);

  const handleMouseOver = (date) => {
    setHoveredDate(date);
  };

  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  const formatPublicationEvent = (publication) => {
    const eventDate = publication.scheduleDate 
      ? new Date(publication.scheduleDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    return {
      title: publication.message || "Publication",
      date: eventDate,
      extendedProps: {
        type: publication.scheduleDate ? 'Planifiée' : 'Immédiate',
        platform: publication.networks,
        file: publication.file
      }
    };
  };

  useEffect(() => {
    const publicationEvents = events.map(formatPublicationEvent);
    setCalendarEvents(prevEvents => [
      ...prevEvents.filter(event => !event.extendedProps), 
      ...publicationEvents
    ]);
  }, [events]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          dayCellClassNames="day-cell"
          dayCellDidMount={(info) => {
            const dayCell = info.el;
            dayCell.addEventListener("mouseover", () => handleMouseOver(info.date));
            dayCell.addEventListener("mouseout", handleMouseOut);
          }}
          contentHeight="auto"
          eventsClassNames="event-style"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth",
          }}
          dayCellContent={(day) => {
            return (
              `<div class="day-content">
                <span class="day-number">${day.date.getDate()}</span>
              </div>`
            );
          }}
          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            const extendedProps = event.extendedProps;
            
            return (
              <div className="flex flex-col">
                <span className="font-bold">{event.title}</span>
                {extendedProps.type && (
                  <span className="text-xs text-gray-500">
                    {extendedProps.type}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>

      {hoveredDate && (
        <div
          className="absolute top-20 left-1/2 transform -translate-x-1/2 p-2 bg-blue-500 text-white rounded-md"
        >
          {hoveredDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default Calendar;