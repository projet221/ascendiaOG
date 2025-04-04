import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import SidebarPublication from "../../components/SideBarPublication.jsx";
import BarreHaut from "../../components/BarreHaut.jsx";
import Previsualisation from "../../components/Previsualisation.jsx";

const All = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/twitter/${userId}`);
        setTweets(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des publications.");
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div>
      {/* Barre du haut */}
      <BarreHaut />

      <div className="flex">
        {/* Sidebar */}
        <SidebarPublication />

        {/* Contenu principal */}
        <main className="flex-1 ml-64 mt-16 p-6">
          {loading && (
            <p className="text-gray-500">Chargement des publications...</p>
          )}
          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-center mb-4" style={{ color: '#FF0035' }}>
                Mes Publications
              </h1>

              {tweets.length > 0 ? (
                tweets.map((tweet) => (
                  <div key={tweet.id} className="border-b py-4">
                    <p className="text-lg">{tweet.text}</p>
                    {tweet.image && (
                      <img
                        src={tweet.image}
                        alt="Image du tweet"
                        className="mt-2 rounded-md"
                      />
                    )}
                    <Previsualisation tweet={tweet} />
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Aucune publication disponible.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default All;
