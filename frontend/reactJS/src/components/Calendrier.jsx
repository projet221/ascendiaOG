import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Plugin de grille pour gérer l'affichage du mois
import interactionPlugin from "@fullcalendar/interaction"; // Plugin pour interagir avec le calendrier (survol, clics)

const Calendar = () => {
  const [hoveredDate, setHoveredDate] = useState(null);

  // Fonction pour gérer le survol
  const handleMouseOver = (date) => {
    setHoveredDate(date);
  };

  // Réinitialiser la date du survol
  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // Utilisation des plugins dayGrid et interaction
          initialView="dayGridMonth" // Vue par défaut : grille mensuelle
          events={[
            { title: "Exemple d'événement", date: "2025-03-30" },
            { title: "Réunion", date: "2025-03-31" },
          ]}
          dayCellClassNames="day-cell"
          // Interactions sur les cellules de jour
          dayCellDidMount={(info) => {
            const dayCell = info.el;

            dayCell.addEventListener("mouseover", () => handleMouseOver(info.date)); // Survol
            dayCell.addEventListener("mouseout", handleMouseOut); // Quitter le survol
          }}
          // Appliquer un style horizontal pour la grille
          contentHeight="auto" // Ajuster la hauteur automatiquement
          eventsClassNames="event-style"
          headerToolbar={{
            left: "prev,next today", // Navigation des mois
            center: "title", // Titre au centre
            right: "dayGridMonth", // Affichage de la vue mois
          }}
          // Styles personnalisés pour aligner les jours horizontalement
          dayCellContent={(day) => {
            return (
              `<div class="day-content">
                <span class="day-number">${day.date.getDate()}</span>
              </div>`
            );
          }}
        />
      </div>

      {/* Affichage de la date au survol */}
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
