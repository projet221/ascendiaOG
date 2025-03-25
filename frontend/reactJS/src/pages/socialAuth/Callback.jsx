import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.jsx";

function Callback() {
    const location = useLocation();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const handleCallback = async () => {
            if (!user_id) {
                console.error("Aucun user_id trouvé dans le localStorage.");
                window.close(); // Ferme la fenêtre si aucun user_id trouvé
                return;
            }

            const urlParams = Object.fromEntries(new URLSearchParams(location.search));

            try {
                const response = await axiosInstance.post(
                    "/api/socialAuth/save",
                    { user_id, urlParams },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                console.log("Réponse API:", response.data);

                // Fermer la fenêtre après le traitement
                window.close();
            } catch (err) {
                console.error("Erreur lors de l'appel API:", err);
                // Ferme la fenêtre même en cas d'erreur
                window.close();
            }
        };

        handleCallback();
    }, [location.search, user_id]);

    return <div>Redirection en cours...</div>;
}

export default Callback;
