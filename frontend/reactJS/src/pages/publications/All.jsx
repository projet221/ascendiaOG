import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios"; // Assure-toi que le chemin est correct
import SidebarPublication from "../../components/SideBarPublication.jsx"; // Sidebar
import BarreHaut from "../../components/BarreHaut.jsx"; // Barre en haut de la page
import Previsualisation from "../../components/Previsualisation.jsx"; // Pour prévisualiser les tweets

const All = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId,setUserId] = useState(localStorage.getItem("user_id"));

  // Charger les publications lorsque le composant est monté
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/twitter/${userId}`);
        console.log(response.data); // Assure-toi que l'URL correspond bien à ton API backend
        setTweets(response.data); // Stocke les tweets récupérés dans l'état
          
      } catch (err) {
        setError("Erreur lors de la récupération des publications.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="flex">
      <SidebarPublication /> {/* La barre latérale */}
      <div className="flex-1 ml-64 p-6">
        <BarreHaut /> {/* Barre en haut de la page */}
        
        {/* Afficher un message de chargement ou une erreur si nécessaire */}
        {loading && <p>Chargement des publications...</p>}
        {error && <p>{error}</p>}

        {/* Si les publications sont récupérées avec succès */}
        {tweets.length > 0 ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
              Mes Publications
            </h1>

            {tweets.map((tweet) => (
              <div key={tweet.id} className="border-b py-4">
                <p className="text-lg">{tweet.text}</p>
                {/* Si un tweet a une image, on l'affiche */}
                {tweet.image && <img src={tweet.image} alt="Image du tweet" className="mt-2" />}
                <Previsualisation tweet={tweet} /> {/* Composant pour afficher la prévisualisation du tweet */}
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune publication disponible.</p>
        )}
      </div>
    </div>
  );
};

export default All;
