import { useState, useEffect, useRef } from "react";
import { EyeOff } from 'lucide-react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import SelectCompte from "../components/SelectCompte.jsx";
import AjoutFichierBouton from "../components/AjoutFichierBouton.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import SidebarPublication from "../components/SideBarPublication.jsx";
import { axiosInstance } from "../utils/axios";
import Previsualisation from "../components/Previsualisation.jsx";

function Publier() {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [networks, setNetworks] = useState([]);
  const [action, setAction] = useState("");
  const [fichier, setFichier] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const dateInputRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [hoverDate, setHoverDate] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ajouterEvenementCalendrier = (date, message) => {
    const nouvelEvenement = {
      title: "📅 Publication",
      start: date,
      extendedProps: { message },
    };
    setEvents((prevEvents) => [...prevEvents, nouvelEvenement]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handlePublish = async () => {
    if (action === "maintenant") {
      await publierMaintenant();
      ajouterEvenementCalendrier(new Date(), message);
    } else if (action === "planifier") {
      await planifierPublication();
      ajouterEvenementCalendrier(new Date(scheduleDate), message);
    } else {
      alert("Veuillez sélectionner une action !");
    }
  };

  const publierMaintenant = async () => {
    if (!message || !networks.length) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("networks", networks);
      formData.append("message", message);
      if (fichier) {
        formData.append("file", fichier);
      }
      await axiosInstance.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la publication :", err.message);
    }
  };

  const planifierPublication = async () => {
    if (!message || !networks.length || !scheduleDate) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("networks", networks);
      formData.append("message", message);
      formData.append("scheduleDate", scheduleDate);
      if (fichier) {
        formData.append("file", fichier);
      }
      await axiosInstance.post("/api/posts/schedule", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la planification :", err.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <BarreHaut />
      <SidebarPublication />

      <div className="ml-64 mt-16 flex">
        <div className="w-2/3 p-6">
          <SelectCompte networks={networks} setNetworks={setNetworks} />
          <textarea
            className="w-full border border-gray-300 rounded-md p-4"
            value={message}
            onChange={handleMessageChange}
            placeholder="Écrivez votre message..."
          />
          <AjoutFichierBouton gestionFichier={setFichier} />

          <select className="mt-4 p-2 border rounded-md" value={action} onChange={handleActionChange}>
            <option value="">-- Sélectionnez une option --</option>
            <option value="maintenant">Publier Maintenant</option>
            <option value="planifier">Planifier</option>
          </select>

          {action === "planifier" && (
            <input
              type="datetime-local"
              className="mt-4 p-2 border rounded-md"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          )}

          <button onClick={handlePublish} className="mt-4 bg-red-500 text-white py-2 px-6 rounded">
            Publier
          </button>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={frLocale}
            events={events}
            dayCellClassNames={({ date }) => (hoverDate === date.toISOString().split("T")[0] ? "bg-blue-200" : "")}
            dayCellMouseEnter={(e) => setHoverDate(e.date.toISOString().split("T")[0])}
            dayCellMouseLeave={() => setHoverDate(null)}
          />
        </div>

        <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-white">
          <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
          {networks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <EyeOff className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Rien à voir pour l'instant...</p>
            </div>
          ) : (
            networks.map((account, index) => (
              <Previsualisation
                key={index}
                platform={account.platform || account}
                text={message}
                image={fichier ? URL.createObjectURL(fichier) : null}
                username={account.username || "JohnDoe"}
                profilePic={account.profilePic || "/default-avatar.png"}
              />
            ))
          )}
        </div>

        {hoverDate && (
          <div
            className="absolute bg-blue-500 text-white px-3 py-1 rounded-md shadow-lg"
            style={{ left: mousePosition.x + 10, top: mousePosition.y + 10 }}
          >
            {hoverDate}
          </div>
        )}
      </div>
    </div>
  );
}

export default Publier;