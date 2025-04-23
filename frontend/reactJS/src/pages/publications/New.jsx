import { useState, useEffect, useRef } from "react";
import { EyeOff } from 'lucide-react';

import SelectCompte from "../../components/SelectCompte.jsx";
import AjoutFichierBouton from "../../components/AjoutFichierBouton.jsx";
import BarreHaut from "../../components/BarreHaut.jsx";
import SidebarPublication from "../../components/SideBarPublication.jsx";
import { axiosInstance } from "../../utils/axios";
import Previsualisation from "../../components/Previsualisation.jsx";

import { Bold, Italic, Underline, Wand2, Languages } from 'lucide-react';

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
        publicite: "Découvrez notre nouveau produit ! 🔥\n[Décrire le produit] \n\n\n\n#Promo #NouveauProduit #[NomProduit]",
        annonce: "Nous avons une grande nouvelle à partager avec vous ! 🎉\n[Faites votre annonce] \n\n\n\n#Annonce #Important",
        evenement: "Rejoignez-nous pour notre événement spécial ce week-end ! 🎈\n [Parlez de l'évènement] \n\n\n\n#Événement #Invitation",
        promotion : " ⚡  Offre limitée dans le temps ! Profitez de -[x]% sur tout le site aujourd'hui seulement. \n [www.exemple.com]\n\n\n\n#BonPlan #PromoDuJour #[NomBoutique] ",
        sondage : "📊 On a besoin de votre avis ! Préférez-vous [A] ou [B] ? Répondez en commentaire 👇 \n\n\n\n#Sondage #VotreAvisCompte #[ThemeDuSondage]",
        retourEvenement : "Merci à tous pour votre présence ce week-end 🙌 Revivez les meilleurs moments en images ! \n\n\n\n #AfterEvent #Souvenirs #[NomEvenement]"
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
        } else if (action === "brouillon") {
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

            if (fichier) {
                formData.append("file", fichier);
            }

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
            window.location.reload();
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
            networks.forEach(n => {
                formData.append("networks[]", n);
            });
            formData.append("message", message);

            if (fichier) {
                formData.append("file", fichier);
            }

            formData.append("scheduleDate", scheduleDate);

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
            const tomorrow1230 = new Date(year, month, day + 1, 14, 30);
            bestTime = tomorrow1230;
        }

        return bestTime.toISOString().slice(0, 16);
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        console.log("le fichier", fichier);
    }, [fichier]);

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
                    <div className="h-screen bg-gray-100 overflow-y-auto p-6">
                            <SelectCompte networks={networks} setNetworks={setNetworks} setInfoComptes={setInfoComptes} />

                            <div className="mb-4">
                                <label className="block mb-2 text-gray-700 font-medium">Choisissez un modèle de message :</label>
                                <div className="flex gap-3 flex-wrap">
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
                                            className={`px-4 py-2 rounded-lg border font-medium ${
                                                selectedTemplate === key
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white hover:bg-red-100 text-red-500 border-red-500'
                                            }`}
                                        >
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </button>
                                    ))}

                                </div>
                            </div>

                            <div className="relative mb-6">
                                <label htmlFor="message" className="block text-gray-700 mb-2">Votre message :</label>
                                <textarea
                                    id="message"
                                    className="w-full border border-gray-300 rounded-md p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                                    style={{ minHeight: "300px", minWidth: "500px" }}
                                    value={message}
                                    onChange={handleMessageChange}
                                ></textarea>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <button onClick={() => {/* Gras */}}><Bold className="w-5 h-5 text-gray-600" /></button>
                                    <button onClick={() => {/* Italique */}}><Italic className="w-5 h-5 text-gray-600" /></button>
                                    <button onClick={() => {/* Souligner */}}><Underline className="w-5 h-5 text-gray-600" /></button>
                                    <button onClick={() => {/* Correction IA */}} className="flex items-center gap-1 text-blue-600 text-sm hover:underline"><Wand2 className="w-5 h-5" />Corriger</button>
                                    <div className="flex items-center gap-1 text-green-700">
                                        <Languages className="w-5 h-5" />
                                        <label htmlFor="langues" className="text-sm">Traduire en</label>
                                        <select id="langues" className="border border-gray-300 rounded px-2 py-1 text-sm" onChange={(e) => { const lang = e.target.value; /* traduction(lang) */ }}>
                                            <option value="">Langue</option>
                                            <option value="en">Anglais</option>
                                            <option value="es">Espagnol</option>
                                            <option value="it">Italien</option>
                                            <option value="ru">Russe</option>
                                            <option value="zh">Mandarin</option>
                                            <option value="de">Allemand</option>
                                            <option value="pt">Portugais</option>
                                            <option value="ja">Japonais</option>
                                            <option value="ar">Arabe</option>
                                        </select>
                                    </div>
                                    <span className="ml-auto"><AjoutFichierBouton gestionFichier={setFichier} /></span>
                                </div>

                                {/*<div className="absolute bottom-2 right-3">
                                    <button className="bg-[#FF0035] hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow"> Correction IA</button>
                                    <AjoutFichierBouton gestionFichier={setFichier} />
                                </div>*/}
                            </div>

                            <label htmlFor="publish-select">Choisissez une action : </label>
                            <select
                                id="publish-select"
                                className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md w-fit mt-4"
                                value={action}
                                onChange={handleActionChange}
                            >
                                <option value="" disabled>-- Sélectionnez une option --</option>
                                <option value="maintenant">Publier Maintenant</option>
                                <option value="planifier">Planifier</option>
                                <option value="best">Publier au meilleur moment</option>
                            </select>
                            <button
                                onClick={handlePublish}
                                className="mt-50 ml-40 bg-[#FF0035] hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow"
                            >
                                Publier
                            </button>
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

                <div className="w-1/3 fixed right-0 top-16 h-screen overflow-y-auto p-6 border-l bg-white">
                <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
                {networks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <EyeOff className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Rien à voir pour l'instant...</p>
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
