import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

const Calendar = ({ events }) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  return (
    <div className="fc-calendar relative">
      {/* Affichage de la date au centre haut */}
      {hoveredDate && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded shadow-md text-sm">
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
        dayCellDidMount={(cellInfo) => {
          cellInfo.el.addEventListener("mouseenter", () => {
            setHoveredDate(cellInfo.date.toLocaleDateString("fr-FR"));
          });
          cellInfo.el.addEventListener("mouseleave", () => {
            setHoveredDate(null);
          });
        }}
      />
    </div>
  );
};

export default Calendar;
