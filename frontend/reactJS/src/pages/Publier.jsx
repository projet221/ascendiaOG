import { useState, useEffect, useRef } from "react";
import { EyeOff } from 'lucide-react';
import SelectCompte from "../components/SelectCompte";
import AjoutFichierBouton from "../components/AjoutFichierBouton";
import BarreHaut from "../components/BarreHaut";
import SidebarPublication from "../components/SideBarPublication";
import { axiosInstance } from "../utils/axios";
import Previsualisation from "../components/Previsualisation";
import Calendar from "../components/Calendrier";

function Publier() {
  const [message, setMessage] = useState("");
  const [userId] = useState(localStorage.getItem("user_id"));
  const [networks, setNetworks] = useState([]);
  const [action, setAction] = useState("");
  const [fichier, setFichier] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [events, setEvents] = useState([]);
  const dateInputRef = useRef(null);

  useEffect(() => {
    // Charger les événements existants
    const loadEvents = async () => {
      try {
        const response = await axiosInstance.get("/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur chargement événements:", error);
      }
    };
    loadEvents();
  }, []);

  const handlePublish = () => {
    if (!message || !networks.length) {
      alert("Message et réseaux requis");
      return;
    }

    const newEvent = {
      title: message.length > 15 ? `${message.substring(0, 15)}...` : message,
      date: action === "planifier" ? scheduleDate.split('T')[0] : new Date().toISOString().split('T')[0],
      extendedProps: {
        description: message,
        networks: networks.join(", "),
        type: action === "planifier" ? "planifié" : "publié"
      },
      backgroundColor: action === "planifier" ? "#3b82f6" : "#10b981"
    };

    setEvents([...events, newEvent]);
    resetForm();
  };

  const resetForm = () => {
    setMessage("");
    setFichier(null);
    setAction("");
    setScheduleDate("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <BarreHaut />
      <SidebarPublication />

      <div className="ml-64 pt-16">
        <div className="flex">
          {/* Partie gauche */}
          <div className="w-2/3 p-6">
            <SelectCompte networks={networks} setNetworks={setNetworks} />
            
            <div className="mt-4 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-4 min-h-[200px]"
                placeholder="Votre message..."
              />
              <AjoutFichierBouton className="absolute bottom-3 right-3" gestionFichier={setFichier} />
            </div>

            <div className="mt-4 space-y-4">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="bg-[#FF0035] text-white p-2 rounded"
              >
                <option value="">-- Choisir --</option>
                <option value="maintenant">Publier maintenant</option>
                <option value="planifier">Planifier</option>
              </select>

              {action === "planifier" && (
                <input
                  type="datetime-local"
                  ref={dateInputRef}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="border p-2 rounded"
                />
              )}

              <button
                onClick={handlePublish}
                className="bg-[#FF0035] text-white py-2 px-6 rounded-lg"
              >
                {action === "planifier" ? "Planifier" : "Publier"}
              </button>
            </div>
          </div>

          {/* Partie droite - Prévisualisation */}
          <div className="w-1/3 p-6 border-l bg-white">
            <h2 className="text-xl font-bold mb-4">Prévisualisation</h2>
            {networks.length > 0 ? (
              networks.map((network, i) => (
                <Previsualisation
                  key={i}
                  platform={network.platform}
                  text={message}
                  image={fichier}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 py-10">
                <EyeOff className="mx-auto mb-2" />
                <p>Sélectionnez des réseaux</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendrier */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Calendrier</h2>
          <Calendar events={events} />
        </div>
      </div>
    </div>
  );
}

export default Publier;