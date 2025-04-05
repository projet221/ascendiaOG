import React from "react";
import StatistiquesContent from "../components/StatistiquesContent";

const Statistiques = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
        Page Statistiques
      </h1>
      <StatistiquesContent />
    </div>
  );
};

export default Statistiques;
