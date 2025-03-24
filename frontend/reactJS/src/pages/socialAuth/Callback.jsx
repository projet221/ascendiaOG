import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.jsx";

function Callback() {
    const navigate = useNavigate();  // Utilisation du hook useNavigate
    const location = useLocation();  // Utilisation du hook useLocation pour accéder à l'URL
    const user_id = localStorage.getItem("user_id");

    // Fonction pour récupérer les paramètres de l'URL
    const getUrlParams = () => {
        const params = new URLSearchParams(location.search);  // Crée un objet URLSearchParams
        const network = params.get('network');  // Récupère le paramètre 'network'
        const tokenaccess = params.get('token');  // Récupère le paramètre 'facebook_token' (tu peux l'adapter pour d'autres réseaux)
        return { network, tokenaccess };
    };

    const callback = async () => {
        const urlParams = getUrlParams();  // Récupère les valeurs depuis l'URL

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
