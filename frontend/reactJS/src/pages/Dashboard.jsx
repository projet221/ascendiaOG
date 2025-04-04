import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import ConfigSocialMedia from "../components/ConfigSocialMedia.jsx";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [socials, setSocials] = useState({ facebook: false, instagram: false, twitter: false });
    const [isLoading, setIsLoading] = useState(true); // ← Pour gérer l'état de chargement
    const [showModal, setShowModal] = useState(false); // ← Contrôle l’affichage de la pop-up

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("user_id");

                if (!token || !userId) {
                    console.warn("Aucun token ou user_id trouvé, utilisateur non connecté.");
                    setUsername("Non connecté");
                    // On arrête ici car on sait qu'il ne récupérera pas de connexions
                    setIsLoading(false);
                    return;
                }

                // 1) Récupération de l'utilisateur
                const userResponse = await axiosInstance.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const userData = userResponse.data;
                setUsername(userData.username || "Utilisateur inconnu");

                // 2) Récupération des réseaux connectés
                //    Par exemple: GET /api/socialAuth/:userId
                const providerResponse = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = providerResponse.data || [];
                // Contrôle pour chaque réseau
                const connections = {
                    facebook: data.some((item) => item.provider === "facebook"),
                    instagram: data.some((item) => item.provider === "instagram"),
                    twitter: data.some((item) => item.provider === "twitter"),
                };
                setSocials(connections);

                // Chargement terminé
                setIsLoading(false);

                // Si absolument aucun réseau connecté => on affiche la pop-up
                if (
                    !connections.facebook &&
                    !connections.instagram &&
                    !connections.twitter
                ) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des infos :", error);
                setUsername("Erreur de chargement");
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Affichage conditionnel :
    //  - Tant que isLoading = true, on rend par exemple un loader ou rien.
    //  - Quand isLoading = false, on affiche le contenu.
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <BarreHaut />

            {/* Partie principale */}
            <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
                {isLoading ? (
                    // On peut afficher un spinner ou un message
                    <p>Chargement en cours...</p>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Bonjour {username}
                        </h2>
                        <p>Contenu du dashboard…</p>
                    </>
                )}
            </div>

            {/* MODAL : affichée si showModal = true */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                        {/* Bouton de fermeture */}
                        <button
                            className="absolute top-2 right-2 text-2xl"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>

                        {/* Le composant ConfigSocialMedia */}
                        <ConfigSocialMedia />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
