import {useState, useEffect} from 'react';
//import PrivateRoute from "../components/PrivateRoute.jsx";
import {axiosInstance} from "../utils/axios.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import SidebarPublication from "../components/SideBarPublication.jsx";
import ConfigSocialMedia from '../components/ConfigSocialMedia.jsx';

const Dashboard = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("Aucun token trouvé, l'utilisateur n'est peut-être pas connecté.");
                setUsername("Non connecté");
                return;
            }

            try {
                const response = await axiosInstance.get(
                    "/api/users/" + localStorage.getItem("user_id"),
                    {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });



                const data = response.data;
                if (data.username) {
                    setUsername(data.username);
                } else {
                    console.warn("Données inattendues reçues :", data);
                    setUsername("Utilisateur inconnu");
                }

            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
                setUsername("Erreur de chargement");
            }
        };

        fetchUser();
    }, []); // useEffect exécuté une seule fois au montage du composant
    const deconnexion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.location.reload();
    }
    return (
        <div>
            <BarreHaut />
            <ConfigSocialMedia/>

            Bonjour {username}
            <button onClick={deconnexion}>Déconnexion</button>
        </div>
    );
};

export default Dashboard;
