import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

const Calendar = ({ events }) => {
  const [hoveredDate, setHoveredDate] = React.useState(null);

  const handleMouseOver = (date) => setHoveredDate(date);
  const handleMouseOut = () => setHoveredDate(null);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locales={[frLocale]}
        locale="fr"
        events={events}
        eventContent={(eventInfo) => (
          <div className="p-1">
            <div className="font-medium truncate">{eventInfo.event.title}</div>
            <div className="text-xs text-gray-600">
              {eventInfo.event.extendedProps.networks}
            </div>
          </div>
        )}
        eventClassNames={(eventInfo) => {
          return eventInfo.event.extendedProps.type === "planifié" 
            ? "bg-blue-100 border-blue-300 text-blue-800" 
            : "bg-green-100 border-green-300 text-green-800";
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        height="auto"
        aspectRatio={1.5}
        dayMaxEvents={3}
        editable={true}
        selectable={true}
        dayCellClassNames="hover:bg-gray-50"
        dayCellDidMount={(info) => {
          const dayCell = info.el;
          dayCell.addEventListener("mouseover", () => handleMouseOver(info.date));
          dayCell.addEventListener("mouseout", handleMouseOut);
        }}
      />

      {hoveredDate && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 p-2 bg-blue-500 text-white rounded-md shadow-lg">
          {hoveredDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}

      <div className="mt-4 flex gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 mr-2"></div>
          <span className="text-sm">Planifié</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-300 mr-2"></div>
          <span className="text-sm">Publié</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;