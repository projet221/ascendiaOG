import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import SidebarPublication from "../../components/SideBarPublication.jsx"; 
import Previsualisation from "../../components/Previsualisation.jsx"; // Si tu veux une prévisualisation
import BarreHaut from "../../components/BarreHaut.jsx"; // Barre haute, peut-être pour l'authentification ou autre
import AjoutFichierBouton from "../../components/AjoutFichierBouton.jsx"; // Pour ajouter un fichier, si nécessaire
import SelectCompte from "../../components/SelectCompte.jsx"; // Si tu veux permettre de sélectionner un compte

const All = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        
        const response = await axiosInstance.get('/posts'); // L'URL correcte pour ton API backend
        setTweets(response.data); // Assure-toi que tes données sont dans le format attendu
      } catch (err) {
        setError('Erreur lors de la récupération des publications.');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="flex">
      <SidebarPublication /> {/* Sidebar pour la navigation */}
      <div className="flex-1 ml-64 p-6">
        <BarreHaut /> {/* Barre haute pour affichage général ou actions */}
        
        {loading ? (
          <p>Chargement des publications...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
              Mes Publications
            </h1>
            <div className="space-y-4">
              {tweets.length === 0 ? (
                <p>Aucune publication disponible.</p>
              ) : (
                tweets.map((tweet) => (
                  <div key={tweet.id} className="border-b py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg">{tweet.text}</p>
                    </div>
                    {/* Si le tweet a une image, on l'affiche */}
                    {tweet.image && <img src={tweet.image} alt="Image du tweet" className="mt-2" />}
                    <Previsualisation tweet={tweet} /> {/* Composant pour prévisualiser les publications si nécessaire */}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default All;
