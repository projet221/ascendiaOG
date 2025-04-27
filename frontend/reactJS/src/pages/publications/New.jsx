import { useState, useEffect, useRef } from "react";
import { EyeOff, Send } from 'lucide-react';

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
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const templates = {
        publicite: "Découvrez notre nouveau produit ! 🔥\n[Décrire le produit]\n\n#Promo #NouveauProduit #[NomProduit]",
        annonce: "Nous avons une grande nouvelle à partager avec vous ! 🎉\n[Faites votre annonce]\n\n#Annonce #Important",
        evenement: "Rejoignez-nous pour notre événement spécial ce week-end ! 🎈\n[Parlez de l'évènement]\n\n#Événement #Invitation",
        promotion: "⚡ Offre limitée dans le temps ! Profitez de -[x]% sur tout le site aujourd'hui seulement.\n[www.exemple.com]\n\n#BonPlan #PromoDuJour #[NomBoutique]",
        sondage: "📊 On a besoin de votre avis ! Préférez-vous [A] ou [B] ? Répondez en commentaire 👇\n\n#Sondage #VotreAvisCompte #[ThemeDuSondage]",
        retourEvenement: "Merci à tous pour votre présence ce week-end 🙌 Revivez les meilleurs moments en images !\n\n#AfterEvent #Souvenirs #[NomEvenement]"
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleActionChange = (e) => {
        const selectedAction = e.target.value;
        setAction(selectedAction);
        if (selectedAction === "best") {
            const bestDate = getMeilleurMoment();
            setScheduleDate(bestDate);
        }
    };

    const handlePublish = () => {
        if (message.trim() === "") {
            alert("Le message ne peut pas être vide !");
            return;
        }
        if (action === "maintenant") {
            publierMaintenant();
        } else if (action === "planifier" || action === "best") {
            planifierPublication();
        } else {
            alert("Veuillez sélectionner une action !");
        }
    };

    const publierMaintenant = async () => {
        if (!networks.length) {
            alert("Veuillez sélectionner au moins un réseau !");
            return;
        }
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
        if (!networks.length) {
            alert("Veuillez sélectionner au moins un réseau !");
            return;
        }
        if (scheduleDate === "" || new Date(scheduleDate) < new Date()) {
            alert("Veuillez choisir une date de planification valide !");
            return;
        }
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
        const slots = [
            new Date(new Date().setHours(14, 30, 0, 0)),
            new Date(new Date().setHours(17, 0, 0, 0)),
            new Date(new Date().setHours(21, 45, 0, 0))
        ];
        const best = slots.find(slot => slot > new Date());
        return best ? best.toISOString().slice(0, 16) : new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    return (
        <div>
            <BarreHaut />
            <SidebarPublication />
            <div className="ml-64 mt-16">
                <div className="h-screen flex bg-gray-100 overflow-hidden">
                    <div className="min-h-screen flex bg-gray-100 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <SelectCompte networks={networks} setNetworks={setNetworks} setInfoComptes={setInfoComptes} />
                                <div className="mt-4">
                                    <label className="block mb-2 text-gray-700 font-semibold">Choisissez un modèle de message :</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {Object.keys(templates).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    if (selectedTemplate === key) {
                                                        setSelectedTemplate("");
                                                        setMessage("");
                                                    } else {
                                                        setSelectedTemplate(key);
                                                        setMessage(templates[key]);
                                                    }
                                                }}
                                                className={`px-5 py-2 rounded-full text-sm border font-medium transition-all ${selectedTemplate === key ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-500 hover:text-white text-red-500 border-red-500'}`}
                                            >
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative mt-6">
                                    <label htmlFor="message" className="block text-gray-700 mb-2 font-semibold">Votre message :</label>
                                    <textarea
                                        id="message"
                                        className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none overflow-hidden"
                                        style={{ minHeight: "300px" }}
                                        value={message}
                                        onChange={handleMessageChange}
                                    ></textarea>
                                    <div className="absolute bottom-4 right-4">
                                        <AjoutFichierBouton gestionFichier={setFichier} />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="publish-select" className="block mb-2 font-semibold">Choisissez une action :</label>
                                    <select
                                        id="publish-select"
                                        className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md w-full mt-2"
                                        value={action}
                                        onChange={handleActionChange}
                                    >
                                        <option value="" disabled>-- Sélectionnez une option --</option>
                                        <option value="maintenant">Publier Maintenant</option>
                                        <option value="planifier">Planifier</option>
                                        <option value="best">Publier au meilleur moment</option>
                                    </select>
                                </div>

                                {(action === "planifier" || action === "best") && (
                                    <div className="mt-4 transition-opacity duration-300 ease-in-out">
                                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="schedule-date">
                                            {action === "best" ? "Créneau optimal détecté :" : "Choisissez la date de planification :"}
                                        </label>
                                        <input
                                            id="schedule-date"
                                            type="datetime-local"
                                            ref={dateInputRef}
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            className="border p-2 rounded-md w-full"
                                            disabled={action === "best"}
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handlePublish}
                                    className="flex items-center gap-2 justify-center mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl shadow-md transition-all"
                                >
                                    <Send size={18} /> Publier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
                {networks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <EyeOff className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Rien à voir pour l'instant...</p>
                        <p className="text-sm">Sélectionnez un compte pour voir l’aperçu</p>
                    </div>
                ) : (
                    networks.map((account, index) => (
                        <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-sm">
                            <Previsualisation
                                platform={account.platform || account}
                                text={message}
                                image={fichier ? URL.createObjectURL(fichier) : null}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default New;