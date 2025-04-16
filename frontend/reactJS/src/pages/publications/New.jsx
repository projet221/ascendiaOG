import { useState,useEffect, useRef} from "react";
import { EyeOff } from 'lucide-react';

import SelectCompte from "../../components/SelectCompte.jsx";
import AjoutFichierBouton from "../../components/AjoutFichierBouton.jsx";
import BarreHaut from "../../components/BarreHaut.jsx";
import SidebarPublication from "../../components/SideBarPublication.jsx";
import { axiosInstance } from "../../utils/axios";
import Previsualisation from "../../components/Previsualisation.jsx";

function New() {
    const [message, setMessage] = useState("");
    const userId = localStorage.getItem("user_id");
    const [networks, setNetworks] = useState([]);
    const [action, setAction] = useState(""); // État pour gérer l'action choisie
    const [fichier,setFichier] = useState(null);
    const [scheduleDate, setScheduleDate] = useState("");
    const dateInputRef = useRef(null);
    

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleActionChange = (e) => {
      const selectedAction = e.target.value;
      setAction(selectedAction);
      if (selectedAction === "best") {
        const bestDate = getBestMoment();
        setScheduleDate(bestDate);
      }
    
      console.log(networks);
    };
    
    const handlePublish = () => {
        if (action === "maintenant") {
            publierMaintenant();
        } else if (action === "planifier" || action ==="best") {
            planifierPublication();
        } else if (action === "brouillon") {
            //enregistrerBrouillon();
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

        // Ajouter les autres données du formulaire
            formData.append("userId", userId);
            formData.append("networks", JSON.stringify(networks));
            formData.append("message", message);
            
            if(fichier){
                formData.append("file", fichier);
            }
            
            console.log("le formdata file",formData.get('file') );
            const response = await axiosInstance.post(
                "/api/posts",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
            );

            const data = await response.data;
            if(response.data){
            console.log("Post publié avec succès :", data);
            }
            window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la publication :", err.message);
        }
    };

    const planifierPublication = async () => {
        if (!message || !networks.length) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        try {
            const formData = new FormData();

        // Ajouter les autres données du formulaire
            formData.append("userId", userId);
            networks.forEach(n => {
                formData.append("networks[]", n);
            });
            formData.append("message", message);

            if(fichier){
                formData.append("file", fichier);
            }
            
            if((scheduleDate === "" || new Date(scheduleDate)<new Date())){
                alert("Veuillez choisir une date de planification");
                return;
            }
            formData.append("scheduleDate",scheduleDate);

            console.log("le formdata file",formData.get('file') );
            const response = await axiosInstance.post(
                "/api/posts/schedule",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
            );

            const data = await response.data;
            if(response.data){
            console.log("Post planifié avec succès :", data);
            }
            window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la planification :", err.message);
        }
    };

    const getMeilleurMoment = () => {
      const now = new Date();
    
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
    
      const today1230 = new Date(year, month, day, 12, 30);
      const today1500 = new Date(year, month, day, 15, 0);
      const today1945 = new Date(year, month, day, 19, 45);
    
      let bestTime;
    
      if (now < today1230) {
        bestTime = today1230;
      } else if (now < today1500) {
        bestTime = today1500;
      } else if (now < today1945) {
        bestTime = today1945;
      } else {
        // Demain à 12h30
        const tomorrow1230 = new Date(year, month, day + 1, 12, 30);
        bestTime = tomorrow1230;
      }
    
      return bestTime.toISOString().slice(0, 16); // Pour <input type="datetime-local" />
    };

    

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "auto";
        };
      }, []);


    useEffect(()=>{
        console.log("le fichier",fichier);
    },[fichier]);


    useEffect(() => {
        if (action === "planifier" && dateInputRef.current) {
          setTimeout(() => {
            try {
              dateInputRef.current.showPicker();
            } catch (e) {
              console.warn("Impossible d'ouvrir le sélecteur de date automatiquement", e);
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
                                style={{ minHeight: "300px", minWidth:"500px"}}
                                 value={message}
                                onChange={handleMessageChange}
                          ></textarea>

                          {/* Bouton fichier positionné dans le coin bas droit de la zone texte */}
                          <div className="absolute bottom-2 right-3">
                            <AjoutFichierBouton gestionFichier={setFichier} />
                          </div>
                        </div>

                        <label htmlFor="publish-select">Choisissez une action : </label>
                        <select
                            id="publish-select"
                            className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md w-fit mt-4"
                            value={action}  // Ajout de la valeur contrôlée pour le select
                            onChange={handleActionChange}
                        >
                            <option value="" disabled>
                                -- Sélectionnez une option --
                            </option>
                            <option value="maintenant">Publier Maintenant</option>
                            <option value="planifier">Planifier</option>
                            <option value="best">Publier au meilleur moment</option>
                        </select>
                        {(action === "planifier" || action === "best") && (
                            <div className="mt-4">
                              <label className="block text-gray-700 mb-2" htmlFor="schedule-date">
                                {action === "best" ? "Créneau optimal détecté :" : "Choisissez la date de planification :"}
                              </label>
                              <input
                                id="schedule-date"
                                type="datetime-local"
                                ref={dateInputRef}
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="border p-2 rounded-md"
                                disabled={action === "best"} // facultatif : désactive si choix automatique
                              />
                            </div>
                                    )}
                    <button
                        onClick={handlePublish}
                        className="mt-50 ml-40 bg-[#FF0035] hover:bg-red-700  text-white py-2 px-6 rounded-lg shadow"
                    >
                        Publier
                    </button>
                </div>
               
            </div>
      
        </div>
        </div>
        <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-white">
    <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
    {networks.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <EyeOff className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-lg font-medium">Rien à voir pour l&#39;instant...</p>
    <p className="text-sm">Sélectionnez un compte pour voir l’aperçu</p>
  </div>
) : (
  networks.map((account, index) => (
    <Previsualisation
      key={index}
      platform={account.platform || account}
      text={message}
      image={fichier ? URL.createObjectURL(fichier) : null}
    />
  ))
)}
       
        </div>
        </div>
    );
}

export default New;
