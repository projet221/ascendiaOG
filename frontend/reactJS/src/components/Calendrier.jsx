import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

const Calendar = ({ events }) => {
  return (
    <div className="fc-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: ""
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
      />
    </div>
  );
};

export default Calendar;