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
        <div className="min-h-screen bg-gray-100 flex flex-col">
    <BarreHaut />

    <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Bonjour {username}
      </h2>

      <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <ConfigSocialMedia />
      </div>

      <button
        onClick={deconnexion}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Déconnexion
      </button>
    </div>
  </div>
    );
};

export default Dashboard;
