import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  const [hoveredDate, setHoveredDate] = useState(null);


  const handleMouseOver = (date) => {
    setHoveredDate(date);
  };

  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: "Exemple d'événement", date: "2025-03-30" },
            { title: "Réunion", date: "2025-03-31" },
          ]}
         
          dayCellClassNames="day-cell"
          dayCellDidMount={(info) => {
            const dayCell = info.el;

            dayCell.addEventListener("mouseover", () => handleMouseOver(info.date));
            dayCell.addEventListener("mouseout", handleMouseOut);
          }}
        />
      </div>

      {}
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
