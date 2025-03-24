import {useLocation, useNavigate} from "react-router-dom";
import {axiosInstance} from "../../utils/axios.jsx";

function Callback() {
    const navigate = useNavigate();  // Utilisation du hook useNavigate
    const location = useLocation();  // Utilisation du hook useLocation pour accéder à l'URL
    const user_id = localStorage.getItem("user_id");

    // Fonction pour récupérer les paramètres de l'URL
    const UrlParams = new URLSearchParams(location.search);
    const callback = async () => {
        const urlParams = UrlParams;  // Récupère les valeurs depuis l'URL

        try {
            // Envoi de la requête à l'API
            const response = await axiosInstance.post(
                "/api/socialAuth/save",
                { user_id, urlParams },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = response.data;
            console.log(data);  // Affiche la réponse dans la console

            // Redirige vers le tableau de bord
            navigate("/Dashboard");

        } catch (err) {
            console.error("Erreur lors de l'appel API:", err);
        }
    };

    return (
        <div>
            <button onClick={callback}>
                Aller au tableau de bord
            </button>
        </div>
    );
}

export default Callback;
