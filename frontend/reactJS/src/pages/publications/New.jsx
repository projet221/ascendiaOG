import { useState, useEffect, useRef } from "react";
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
    const [action, setAction] = useState("");
    const [fichier, setFichier] = useState(null);
    const [scheduleDate, setScheduleDate] = useState("");
    const dateInputRef = useRef(null);
    const [infoComptes, setInfoComptes] = useState({});

    const handleMessageChange = (e) => setMessage(e.target.value);

    const handleActionChange = (e) => {
        const selectedAction = e.target.value;
        setAction(selectedAction);
        if (selectedAction === "best") {
            const bestDate = getMeilleurMoment();
            setScheduleDate(bestDate);
        }
    };

    const handlePublish = () => {
        if (message.trim() === "") return alert("Le message ne peut pas être vide !");
        if (action === "maintenant") publierMaintenant();
        else if (action === "planifier" || action === "best") planifierPublication();
        else alert("Veuillez sélectionner une action !");
    };

    const publierMaintenant = async () => {
        if (!networks.length) return alert("Veuillez sélectionner au moins un réseau !");
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("networks", JSON.stringify(networks));
            formData.append("message", message);
            if (fichier) formData.append("file", fichier);
            const response = await axiosInstance.post("/api/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.data) window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la publication :", err.message);
        }
    };

    const planifierPublication = async () => {
        if (!networks.length) return alert("Veuillez sélectionner au moins un réseau !");
        if (scheduleDate === "" || new Date(scheduleDate) < new Date()) return alert("Veuillez choisir une date de planification valide !");
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            networks.forEach(n => formData.append("networks[]", n));
            formData.append("message", message);
            if (fichier) formData.append("file", fichier);
            formData.append("scheduleDate", scheduleDate);
            const response = await axiosInstance.post("/api/posts/schedule", formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (response.data) window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la planification :", err.message);
        }
    };

    const getMeilleurMoment = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const today1230 = new Date(year, month, day, 14, 30);
        const today1500 = new Date(year, month, day, 17, 0);
        const today1945 = new Date(year, month, day, 21, 45);
        let bestTime = now < today1230 ? today1230 : now < today1500 ? today1500 : now < today1945 ? today1945 : new Date(year, month, day + 1, 14, 30);
        return bestTime.toISOString().slice(0, 16);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    useEffect(() => {
        console.log("le fichier", fichier);
    }, [fichier]);

    useEffect(() => {
        if (action === "planifier" && dateInputRef.current) {
            setTimeout(() => {
                try { dateInputRef.current.showPicker(); }
                catch (e) { console.warn("Impossible d'ouvrir le sélecteur de date automatiquement", e); }
            }, 100);
        }
    }, [action]);

    return (
        <div>
            <BarreHaut />
            <SidebarPublication />
            <div className="ml-64 mt-16">
                <div className="min-h-screen flex bg-gray-100 overflow-hidden">
                    <div className="min-h-screen flex bg-gray-100 w-full">
                        <div className="p-6 flex flex-col justify-between min-h-[650px] space-y-6 w-full">
                            <SelectCompte networks={networks} setNetworks={setNetworks} setInfoComptes={setInfoComptes} />

                            <div className="relative mb-6">
                                <label htmlFor="message" className="block text-gray-700 mb-2">Votre message :</label>
                                <textarea
                                    id="message"
                                    className="w-full border border-gray-300 rounded-md p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                                    style={{ minHeight: "300px", minWidth: "500px" }}
                                    value={message}
                                    onChange={handleMessageChange}
                                ></textarea>
                                <div className="absolute bottom-2 right-3">
                                    <AjoutFichierBouton gestionFichier={setFichier} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <select
                                    id="publish-select"
                                    className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                                    value={action}
                                    onChange={handleActionChange}
                                >
                                    <option value="" disabled>
                                        -- Sélectionnez une option --
                                    </option>
                                    <option value="maintenant">Publier Maintenant</option>
                                    <option value="planifier">Planifier</option>
                                    <option value="best">Publier au meilleur moment</option>
                                </select>

                                <button
                                    onClick={handlePublish}
                                    className="bg-[#FF0035] hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow"
                                >
                                    Publier
                                </button>
                            </div>

                            {/* Affichage de la date planifiée (en dessous du bloc au lieu de pousser les autres) */}
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
                                        disabled={action === "best"}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-white">
                <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
                {networks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <EyeOff className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Rien à voir pour l&apos;instant...</p>
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
