import React from "react";
import Calendar from "../components/Calendrier"; 

const Planification = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
        Page Planification
      </h1>

      {}
      <Calendar />
    </div>
  );
};

export default Planification;
