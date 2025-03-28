import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import BarreHaut from "../components/BarreHaut"; // Assurez-vous d'importer votre barre de navigation

const Calendar = () => {
  const [hoveredDate, setHoveredDate] = useState(null);

  const handleMouseOver = (date) => {
    setHoveredDate(date);
  };

  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  return (
    <div>
      <BarreHaut /> {/* Ajoutez votre barre de navigation */}
      <div className="pt-20 p-4"> {/* Ajustez le padding-top pour éviter de cacher le contenu sous la barre de navigation */}
        <FullCalendar
          height="auto" // Définit la hauteur automatique pour occuper tout l'espace
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
      
      {hoveredDate && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 p-2 bg-blue-500 text-white rounded-md">
          {hoveredDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default Calendar;