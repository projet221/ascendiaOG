import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

const Calendar = ({ events }) => {
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  const handleMouseEnter = (event, date) => {
    const { clientX, clientY } = event;
    setTooltip({
      visible: true,
      text: date.toLocaleDateString("fr-FR"),
      x: clientX + 10, // Décalage léger pour éviter que la souris ne cache le tooltip
      y: clientY + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  return (
    <div className="fc-calendar">
      {/* Tooltip pour afficher la date au survol */}
      {tooltip.visible && (
        <div
          id="tooltip-date"
          style={{ top: tooltip.y, left: tooltip.x }}
          className="absolute"
        >
          {tooltip.text}
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
          cellInfo.el.addEventListener("mouseenter", (event) => handleMouseEnter(event, cellInfo.date));
          cellInfo.el.addEventListener("mouseleave", handleMouseLeave);
        }}
      />
    </div>
  );
};

export default Calendar;
