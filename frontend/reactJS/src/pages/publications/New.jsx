import { useState, useEffect, useRef } from "react";
import { EyeOff } from 'lucide-react';

import SelectCompte from "../../components/SelectCompte.jsx";
import AjoutFichierBouton from "../../components/AjoutFichierBouton.jsx";
import BarreHaut from "../../components/BarreHaut.jsx";
import SidebarPublication from "../../components/SideBarPublication.jsx";
import { axiosInstance } from "../../utils/axios";
import Previsualisation from "../../components/Previsualisation.jsx";

function New() {
    // Déclaration des états nécessaires
    const [message, setMessage] = useState(""); // État pour le message
    const userId = localStorage.getItem("user_id"); // Récupération de l'ID utilisateur depuis le localStorage
    const [networks, setNetworks] = useState([]); // Liste des réseaux sociaux sélectionnés
    const [action, setAction] = useState(""); // Action choisie pour la publication
    const [fichier, setFichier] = useState(null); // Fichier attaché (si présent)
    const [scheduleDate, setScheduleDate] = useState(""); // Date de planification
    const dateInputRef = useRef(null); // Référence pour l'input de date
    const [infoComptes, setInfoComptes] = useState({}); //Pour la page facebook


    // Fonction pour gérer la modification du message
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // Fonction pour gérer le changement de l'action choisie
    const handleActionChange = (e) => {
        const selectedAction = e.target.value;
        setAction(selectedAction);
        if (selectedAction === "best") {
            const bestDate = getMeilleurMoment(); // Calcul du meilleur moment pour publier
            setScheduleDate(bestDate); // Définir la date pour la planification au meilleur moment
        }
    };

    // Fonction principale pour gérer la publication
    const handlePublish = () => {
        if (message.trim() === "") {
            alert("Le message ne peut pas être vide !"); // Vérification si le message est vide
            return;
        }
        if (action === "maintenant") {
            publierMaintenant(); // Publier immédiatement
        } else if (action === "planifier" || action === "best") {
            planifierPublication(); // Planifier la publication
        } else if (action === "brouillon") {
            //enregistrerBrouillon(); // Option pour enregistrer en brouillon (si implémenté)
        } else {
            alert("Veuillez sélectionner une action !");
        }
    };

    // Fonction pour publier immédiatement
    const publierMaintenant = async () => {
        if (!networks.length) {
            alert("Veuillez sélectionner au moins un réseau !"); // Vérifier si des réseaux sont sélectionnés
            return;
        }
        try {
            const formData = new FormData();
            formData.append("userId", userId); // Ajouter l'ID utilisateur
            formData.append("networks", JSON.stringify(networks)); // Ajouter les réseaux sociaux
            formData.append("message", message); // Ajouter le message

            if (fichier) {
                formData.append("file", fichier); // Ajouter le fichier si présent
            }

            // Envoi de la requête pour publier immédiatement
            const response = await axiosInstance.post(
                "/api/posts",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const data = await response.data;
            if (response.data) {
                console.log("Post publié avec succès :", data);
            }
            window.location.reload(); // Recharger la page après la publication
        } catch (err) {
            console.error("Erreur lors de la publication :", err.message);
        }
    };

    // Fonction pour planifier la publication
    const planifierPublication = async () => {
        if (!networks.length) {
            alert("Veuillez sélectionner au moins un réseau !"); // Vérifier si des réseaux sont sélectionnés
            return;
        }
        if (scheduleDate === "" || new Date(scheduleDate) < new Date()) {
            alert("Veuillez choisir une date de planification valide !");
            return; // Vérification si la date est valide
        }
        try {
            const formData = new FormData();
            formData.append("userId", userId); // Ajouter l'ID utilisateur
            networks.forEach(n => {
                formData.append("networks[]", n); // Ajouter les réseaux sociaux sélectionnés
            });
            formData.append("message", message); // Ajouter le message

            if (fichier) {
                formData.append("file", fichier); // Ajouter le fichier si présent
            }

            formData.append("scheduleDate", scheduleDate); // Ajouter la date de planification

            const response = await axiosInstance.post(
                "/api/posts/schedule",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const data = await response.data;
            if (response.data) {
                console.log("Post planifié avec succès :", data);
            }
            window.location.reload(); // Recharger la page après la planification
        } catch (err) {
            console.error("Erreur lors de la planification :", err.message);
        }
    };

    // Fonction pour obtenir le meilleur moment pour publier
    const getMeilleurMoment = () => {
      const now = new Date();
    
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
    
      const today1230 = new Date(year, month, day, 14, 30);
      const today1500 = new Date(year, month, day, 17, 0);
      const today1945 = new Date(year, month, day, 21, 45);
    
      let bestTime;
    
      if (now < today1230) {
        bestTime = today1230;
      } else if (now < today1500) {
        bestTime = today1500;
      } else if (now < today1945) {
        bestTime = today1945;
      } else {
        // Demain à 12h30
        const tomorrow1230 = new Date(year, month, day + 1, 14, 30);
        bestTime = tomorrow1230;
      }
    
      return bestTime.toISOString().slice(0, 16); // Pour <input type="datetime-local" />

    };

    // Utilisation d'un useEffect pour empêcher le scroll pendant le chargement de la page
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Utilisation d'un useEffect pour afficher le fichier choisi
    useEffect(() => {
        console.log("le fichier", fichier);
    }, [fichier]);

    // Utilisation d'un useEffect pour afficher automatiquement le sélecteur de date lors du choix de l'action "planifier"
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
                            <SelectCompte networks={networks} setNetworks={setNetworks}  setInfoComptes={setInfoComptes}
                            />
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
                            platform="facebook"{account.platform || account}
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
