import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import PopupPosts from "./PopupPosts";

// eslint-disable-next-line react/prop-types
const Calendar = ({ events, countPerDay}) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedDate,setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  /*
const countPerDay = events.reduce((acc, post) => {
  const dateStr = new Date(post.scheduledFor).toISOString().split("T")[0];
  acc[dateStr] = (acc[dateStr] || 0) + 1;
  return acc;

}, {});*/

useEffect(() => {
  if (!calendarRef.current) return;

  // Forcer le recalcul des cellules
  const calendarApi = calendarRef.current.getApi();
  calendarApi.render(); // 🔁 Forcer le render du calendrier
}, [events]);


console.log("les posts a venir",countPerDay);

  const handleDateMouseEnter = (cellInfo, event) => {
    const formattedDate = cellInfo.date.toLocaleDateString("fr-FR");
    setHoveredDate(formattedDate);
    
    // Position tooltip near the cursor
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleDateMouseLeave = () => {
    setHoveredDate(null);
  };

  return (

    <div className="fc-calendar mx-28">
      {/* Tooltip for date */}
      {hoveredDate && (
        <div 
          id="tooltip-date"
          style={{
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            opacity: 1
          }}
        >
          {hoveredDate}
        </div>
      )}
      

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        events={events}
        dateClick={(info) => {
          console.log("Cellule cliquée :", info.dateStr);
          setSelectedDate(info.dateStr);
          setPopupOpen(true);
        }}
        dayCellDidMount={(cellInfo) => {
          const cell = cellInfo.el;
          
          const dateStr = cellInfo.date.toLocaleDateString('fr-CA');
          console.log(dateStr);
          const count = countPerDay[dateStr];
          console.log(count);
          if (count) {
            const countEl = document.createElement("div");
            countEl.textContent = `${count} post${count > 1 ? 's' : ''}`;
            countEl.className = "scheduled-count";
            cell.appendChild(countEl);
          }

          // Gérer hover
          cell.addEventListener("mouseenter", (event) => {
            handleDateMouseEnter(cellInfo, event);
          });
          cell.addEventListener("mouseleave", () => {
            handleDateMouseLeave();
          });
        }}
        eventContent={(eventInfo) => (
          <div className="fc-event-content">
            <div className="fc-event-title">
              {eventInfo.event.title}
            </div>
            {eventInfo.event.extendedProps?.networks && (
              <div className="fc-event-networks">
                {eventInfo.event.extendedProps.networks}
              </div>
            )}
          </div>
        )}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        height="auto"
      />
      <PopupPosts isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} posts = {events} date = {selectedDate} >
  <h2 className="text-lg font-bold mb-2">Popup calendrier</h2>

</PopupPosts>
    </div>
  );
};

export default Calendar;