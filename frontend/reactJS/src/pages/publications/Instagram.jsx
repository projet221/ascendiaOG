import { useState, useEffect } from "react";
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import axios from "axios";

const Instagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = "EAAOzyCfqi5EBO7MDIqUTVEUc99dGKnK4pWElcZAfuGM77EFnMAQOzsI7m9dfbBDdTP8LErZBZB64zbpGKmIF3dsTZAIOIUGPFFgYT4i9QDvOmAu9pGRvFpOjATHUHEBfEwrTxyjtvdkzXH2jvV06JhNem2n5ZAqblwQP0DKgK9sRxlvjFT3tvUMaZBj4XzfufzB3X5qLlEqgES7bwYjIZBKXbxiU3sZD";
  const igUserId = "17841472341351112";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `https://graph.facebook.com/v19.0/${igUserId}/media`,
          {
            params: {
              access_token: accessToken,
              fields: "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url",
            },
          }
        );

        const formatted = res.data.data.map((post) => ({
          id: post.id,
          caption: post.caption,
          media_type: post.media_type,
          image: post.media_url || post.thumbnail_url,
          permalink: post.permalink,
          timestamp: post.timestamp,
        }));

        setPosts(formatted);
      } catch (err) {
        console.error("Erreur récupération posts Instagram :", err);
        setError("Erreur lors du chargement des publications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-center text-[#FF0035] mb-6">
            Publications Instagram
          </h1>

          {loading && <p className="text-gray-500 text-center">Chargement...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 transition hover:shadow-lg"
                >
                  <img
                    src={post.image}
                    alt="Post Instagram"
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                  <div className="text-sm text-gray-800 space-y-1">
                    <p><strong>🆔 ID :</strong> {post.id}</p>
                    <p><strong>📝 Caption :</strong> {post.caption || "Aucune description."}</p>
                    <p><strong>📷 Type :</strong> {post.media_type}</p>
                    <p><strong>🔗 Lien :</strong>{" "}
                      <a href={post.permalink} target="_blank" rel="noreferrer" className="text-[#FF0035] underline">
                        Voir sur Instagram
                      </a>
                    </p>
                    <p><strong>🕒 Date :</strong> {new Date(post.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-gray-600">Aucune publication trouvée.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Instagram;
