import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.jsx";
import PropTypes from 'prop-types';

function SocialButton({ network, logo, handleClick }) {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
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

                if (data.some(item => item.provider === network)) {
                    setConnected(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };

        fetchSocial();
    }, [network]);

    return (
        connected ? (
            <button
                disabled={true}
                className="w-full bg-green-500 text-white py-3 rounded flex items-center justify-center space-x-2"

            >Connecté sur {network}</button>
        ) : (
            <button
                onClick={handleClick}
                className="w-full bg-gray-400 text-white py-3 rounded hover:bg-blue-600 transition flex items-center justify-center space-x-2"
            >
                <span>Se connecter avec {network} {logo}</span>
            </button>
        )
    );
}

// Définition des PropTypes
SocialButton.propTypes = {
    network: PropTypes.string.isRequired,
    logo: PropTypes.node.isRequired,
    handleClick: PropTypes.func.isRequired,
};

export default SocialButton;
