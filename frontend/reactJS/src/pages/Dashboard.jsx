import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import ConfigSocialMedia from "../components/ConfigSocialMedia.jsx";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [connectedNetworks, setConnectedNetworks] = useState([]); // Stockera les réseaux connectés

    useEffect(() => {
        const fetchUserAndNetworks = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                console.warn("Aucun token ou user_id trouvé, l'utilisateur n'est peut-être pas connecté.");
                setUsername("Non connecté");
                return;
            }

            try {
                // 1) Récupérer d’abord les infos de l’utilisateur
                const userResponse = await axiosInstance.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const userData = userResponse.data;
                if (userData.username) {
                    setUsername(userData.username);
                } else {
                    console.warn("Données inattendues reçues :", userData);
                    setUsername("Utilisateur inconnu");
                }

                // 2) Récupérer la liste des réseaux connectés via votre endpoint
                //    getSocialMediaProviderByUserId (qui renvoie le provider et le profil)
                const providerResponse = await axiosInstance.get(`/api/socialAuth/provider/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // Exemple : providerResponse.data = [{ provider: "facebook", ...}, { provider: "twitter", ... }, ...]
                const providers = providerResponse.data || [];

                // 3) Mettre à jour l’état
                setConnectedNetworks(providers);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations :", error);
                setUsername("Erreur de chargement");
            }
        };

        fetchUserAndNetworks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <BarreHaut />

            <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Bonjour {username}
                </h2>

                {/* On n’affiche ConfigSocialMedia que si aucun réseau n’est connecté */}
                {connectedNetworks.length === 0 && (
                    <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
                        <ConfigSocialMedia />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
