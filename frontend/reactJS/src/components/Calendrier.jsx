import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

const Calendar = ({ events }) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  return (
    <div className="fc-calendar relative">
      {hoveredDate && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded shadow-md">
          {hoveredDate}
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventContent={(eventInfo) => (
          <div className="fc-event-content">
            <div className="fc-event-title">{eventInfo.event.title}</div>
            <div className="fc-event-networks">
              {eventInfo.event.extendedProps?.networks}
            </div>
          </div>
        )}
        dayCellContent={(cellInfo) => (
          <div
            className="day-cell relative p-2 transition-colors duration-200"
            onMouseEnter={() => setHoveredDate(cellInfo.date.toLocaleDateString("fr-FR"))}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {cellInfo.dayNumberText}
          </div>
        )}
      />
      <style jsx>{`
        .day-cell:hover {
          background-color: rgba(0, 0, 255, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
