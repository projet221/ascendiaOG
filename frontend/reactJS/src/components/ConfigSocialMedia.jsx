import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import SocialButton from "./SocialButton";
import { axiosInstance } from "../utils/axios.jsx";

function ConfigSocialMedia() {
    const [error, setError] = useState(null);
    const [socialConnections, setSocialConnections] = useState({
        facebook: false,
        twitter: false,
        instagram: false,
    });
    const [loading, setLoading] = useState(true);  // Nouvel état pour le chargement

    const deconnexion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.location.reload();
    };

    const handleLinkSocialMedia = async (network) => {
        try {
            let authUrl = import.meta.env.VITE_PROXY_GATEWAY + `/api/socialauth/connect/${network}`;

            const width = 600;
            const height = 700;
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;

            const authWindow = window.open(
                authUrl,
                "_blank",
                `width=${width},height=${height},top=${top},left=${left}`,
            );

            const checkPopupClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkPopupClosed);
                    console.log("Fenêtre d'authentification fermée. Mise à jour des connexions...");
                    fetchSocial(); // Appel de la fonction pour actualiser les connexions après la fermeture du popup
                }
            }, 1000);
        } catch (err) {
            setError(`Une erreur est survenue lors de la connexion au réseau social : ${err.message}`);
        }
    };

    const fetchSocial = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            console.warn("Token ou user_id non trouvé, l'utilisateur n'est peut-être pas connecté.");
            return;
        }

        try {
            const response = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = response.data;
            console.warn("Données reçues :", data);

            // Mettre à jour l'état avec les connexions sociales
            const connections = {
                facebook: data.includes('facebook'),
                twitter: data.includes('twitter'),
                instagram: data.includes('instagram'),
            };

            setSocialConnections(connections); // Mettre à jour l'état des connexions
            setLoading(false); // Fin du chargement
        } catch (err) {
            setError(`Erreur lors de la récupération des données utilisateur : ${err}`);
            setLoading(false); // Fin du chargement même en cas d'erreur
        }
    };

    useEffect(() => {
        fetchSocial(); // Appeler la fonction pour charger les connexions sociales au montage
    }, []); // Exécuter cette logique au montage du composant

    if (loading) {
        return <div className="text-center">Chargement...</div>; // Afficher un message de chargement pendant que les données sont récupérées
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Configurer vos réseaux sociaux</h2>
            <div className="space-y-4">
                {/* Assurez-vous que le logo que vous passez est le bon icône */}
                <SocialButton
                    handleClick={() => handleLinkSocialMedia('facebook')}
                    logo={<FaFacebook size={20} />}
                    network="facebook"
                    connected={socialConnections.facebook} // Connexion dynamique
                />
                <SocialButton
                    handleClick={() => handleLinkSocialMedia('twitter')}
                    logo={<FaTwitter size={30} />}
                    network="twitter"
                    connected={socialConnections.twitter} // Connexion dynamique
                />
                <SocialButton
                    handleClick={() => handleLinkSocialMedia('instagram')}
                    logo={<FaInstagram size={30} />}
                    network="instagram"
                    connected={socialConnections.instagram} // Connexion dynamique
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            <button
                className="w-full bg-gray-400 text-white py-3 mt-6 rounded hover:bg-red-600 transition"
                onClick={deconnexion}>
                Déconnexion
            </button>
        </div>
    );
}

export default ConfigSocialMedia;
