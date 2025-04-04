import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import ConfigSocialMedia from "../components/ConfigSocialMedia.jsx";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    // Objet qui décrit l'état de connexion à chaque réseau
    const [socials, setSocials] = useState({
        facebook: false,
        instagram: false,
        twitter: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                console.warn("Aucun token ou user_id trouvé, l'utilisateur n'est pas connecté.");
                setUsername("Non connecté");
                return;
            }

            try {
                // 1) Récupérer d’abord l'utilisateur
                const userResponse = await axiosInstance.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const userData = userResponse.data;
                setUsername(userData.username || "Utilisateur inconnu");

                // 2) Récupérer la liste des connexions
                const providerResponse = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // providerResponse.data ressemble à :
                // [ { provider: "facebook" }, { provider: "instagram" }, ... ]
                const data = providerResponse.data || [];

                // Mise à jour de l’état socials
                const connections = {
                    facebook: data.some((item) => item.provider === "facebook"),
                    instagram: data.some((item) => item.provider === "instagram"),
                    twitter: data.some((item) => item.provider === "twitter"),
                };
                setSocials(connections);

            } catch (error) {
                console.error("Erreur lors de la récupération des informations :", error);
                setUsername("Erreur de chargement");
            }
        };

        fetchData();
    }, []);

    // Vérifie si tous les réseaux sont "false"
    const allDisconnected = !socials.facebook && !socials.instagram && !socials.twitter;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <BarreHaut />

            <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Bonjour {username}
                </h2>

                {/* Si TOUT est non connecté => affiche ConfigSocialMedia */}
                {allDisconnected && (
                    <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
                        <ConfigSocialMedia />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
