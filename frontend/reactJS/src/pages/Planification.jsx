import React, { useState } from "react";
import Calendar from "../components/Calendrier"; 

const Planification = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
        Page Planificatiofffn
      </h1>

      <Calendar events={calendarEvents} />
    </div>
  );
};

export default Planification;