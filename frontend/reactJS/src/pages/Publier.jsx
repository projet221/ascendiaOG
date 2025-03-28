import { useState, useEffect, useRef } from "react";
import { EyeOff } from 'lucide-react';
import SelectCompte from "../components/SelectCompte.jsx";
import AjoutFichierBouton from "../components/AjoutFichierBouton.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import SidebarPublication from "../components/SideBarPublication.jsx";
import { axiosInstance } from "../utils/axios";
import Previsualisation from "../components/Previsualisation.jsx";
import Calendar from "../components/Calendrier.jsx";

function Publier() {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [networks, setNetworks] = useState([]);
  const [action, setAction] = useState("");
  const [fichier, setFichier] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [events, setEvents] = useState([]);
  const dateInputRef = useRef(null);

  // Charger les événements existants au montage du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleActionChange = (e) => setAction(e.target.value);
  
  const handlePublish = () => {
    if (action === "maintenant") {
      publierMaintenant();
    } else if (action === "planifier") {
      planifierPublication();
    } else if (action === "brouillon") {
      enregistrerBrouillon();
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
      formData.append("networks", JSON.stringify(networks));
      formData.append("message", message);

      if (fichier) {
        formData.append("file", fichier);
      }

      const response = await axiosInstance.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        const newEvent = {
          title: message.substring(0, 20) + (message.length > 20 ? "..." : ""),
          date: new Date().toISOString().split('T')[0],
          extendedProps: {
            description: message,
            networks: networks.join(", "),
            type: "publication"
          }
        };
        setEvents(prev => [...prev, newEvent]);
        alert("Publication réussie !");
        resetForm();
      }
    } catch (err) {
      console.error("Erreur lors de la publication :", err);
      alert("Erreur lors de la publication");
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
      formData.append("networks", JSON.stringify(networks));
      formData.append("message", message);
      formData.append("scheduleDate", scheduleDate);

      if (fichier) {
        formData.append("file", fichier);
      }

      const response = await axiosInstance.post("/api/posts/schedule", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        const newEvent = {
          title: message.substring(0, 20) + (message.length > 20 ? "..." : ""),
          date: scheduleDate.split('T')[0],
          extendedProps: {
            description: message,
            networks: networks.join(", "),
            type: "planifié"
          }
        };
        setEvents(prev => [...prev, newEvent]);
        alert("Publication planifiée avec succès !");
        resetForm();
      }
    } catch (err) {
      console.error("Erreur lors de la planification :", err);
      alert("Erreur lors de la planification");
    }
  };

  const resetForm = () => {
    setMessage("");
    setFichier(null);
    setAction("");
    setScheduleDate("");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (action === "planifier" && dateInputRef.current) {
      setTimeout(() => {
        try {
          dateInputRef.current.showPicker();
        } catch (e) {
          console.warn("Impossible d'ouvrir le sélecteur de date", e);
        }
      }, 100);
    }
  }, [action]);

  return (
    <div>
      <BarreHaut />
      <SidebarPublication />

      <div className="ml-64 mt-16">
        <div className="h-screen flex bg-gray-100 overflow-hidden">
          <div className="min-h-screen flex bg-gray-100">
            <div className="p-6">
              <SelectCompte networks={networks} setNetworks={setNetworks} />
              <div className="relative mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Votre message :
                </label>
                <textarea
                  id="message"
                  className="w-full border border-gray-300 rounded-md p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                  style={{ minHeight: "300px", minWidth: "500px" }}
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Écrivez votre message ici..."
                ></textarea>

                <div className="absolute bottom-2 right-3">
                  <AjoutFichierBouton gestionFichier={setFichier} />
                </div>
              </div>

              <label htmlFor="publish-select">Choisissez une action : </label>
              <select
                id="publish-select"
                className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md w-fit mt-4"
                value={action}
                onChange={handleActionChange}
              >
                <option value="" disabled>
                  -- Sélectionnez une option --
                </option>
                <option value="maintenant">Publier Maintenant</option>
                <option value="planifier">Planifier</option>
                <option value="brouillon">Enregistrer en brouillon</option>
              </select>
              
              {action === "planifier" && (
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2" htmlFor="schedule-date">
                    Choisissez la date de planification :
                  </label>
                  <input
                    id="schedule-date"
                    type="datetime-local"
                    ref={dateInputRef}
                    value={scheduleDate}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border p-2 rounded-md"
                  />
                </div>
              )}
              
              <button
                onClick={handlePublish}
                className="mt-6 ml-4 bg-[#FF0035] hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow"
                disabled={!message || !networks.length}
              >
                {action === "planifier" ? "Planifier" : "Publier"}
              </button>
            </div>
          </div>

          <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-white">
            <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
            {networks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <EyeOff className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">Rien à voir pour l'instant...</p>
                <p className="text-sm">Sélectionnez un compte pour voir l'aperçu</p>
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
        </div>

        <div className="mt-10 ml-64 w-[calc(100%-16rem)] p-6">
          <h2 className="text-xl font-semibold mb-4">Calendrier des publications</h2>
          <Calendar events={events} />
        </div>
      </div>
    </div>
  );
}

export default Publier;