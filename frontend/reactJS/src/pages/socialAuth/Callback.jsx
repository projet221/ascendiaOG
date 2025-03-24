import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.jsx";

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const handleCallback = async () => {
            if (!user_id) {
                console.error("Aucun user_id trouvé dans le localStorage.");
                navigate("/login"); // Redirige si pas d'utilisateur
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
                navigate("/Dashboard");
            } catch (err) {
                console.error("Erreur lors de l'appel API:", err);
            }
        };

        handleCallback();
    }, [navigate, location.search, user_id]);

    return <div>Redirection en cours...</div>;
}

export default Callback;
