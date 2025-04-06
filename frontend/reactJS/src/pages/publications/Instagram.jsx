import { useEffect, useState } from "react";
import axios from "axios";

import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";

const Instagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstagramPosts = async () => {
    const API_URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`;
    console.log("📡 Requête envoyée à :", API_URL);

    try {
      const res = await axios.get(API_URL);
      console.log("✅ Publications reçues :", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération Instagram :", err);
      setError("Erreur lors du chargement des publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstagramPosts();
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
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow p-4 transition hover:shadow-lg"
                >
                  {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
                    <img
                      src={post.media_url || post.thumbnail_url}
                      alt={post.caption || "Post Instagram"}
                      className="w-full h-64 object-cover rounded mb-4"
                    />
                  ) : post.media_type === "VIDEO" ? (
                    <video controls className="w-full h-64 rounded mb-4">
                      <source src={post.media_url} type="video/mp4" />
                      Votre navigateur ne supporte pas les vidéos.
                    </video>
                  ) : null}

                  <div className="text-sm text-gray-800 space-y-1">
                    {post.caption && (
                      <p><strong>📝</strong> {post.caption}</p>
                    )}
                    <p><strong>📷 Type:</strong> {post.media_type}</p>
                    <p><strong>🕒</strong> {new Date(post.timestamp).toLocaleString()}</p>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF0035] underline"
                    >
                      Voir sur Instagram
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && !error && <p className="text-center text-gray-600">Aucune publication trouvée.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Instagram;
