import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaCommentDots, FaPlus } from "react-icons/fa";

import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";

const Instagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchInstagramPosts = async () => {
    const API_URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`;
    console.log("📡 Requête envoyée à :", API_URL);

    try {
      const res = await axios.get(API_URL);
      console.log("Publications reçues :", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("Erreur récupération Instagram :", err);
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
        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-4xl font-bold text-center text-[#FF0035] mb-10">
            🎯 Publications Instagram
          </h1>

          {loading && <p className="text-gray-500 text-center">Chargement...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
                >
                  {["IMAGE", "CAROUSEL_ALBUM"].includes(post.media_type) ? (
                    <img
                      src={post.media_url || post.thumbnail_url}
                      alt={post.caption || "Post Instagram"}
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                  ) : post.media_type === "VIDEO" ? (
                    <video controls className="w-full h-64 rounded-xl mb-4">
                      <source src={post.media_url} type="video/mp4" />
                      Votre navigateur ne supporte pas les vidéos.
                    </video>
                  ) : null}

                  <div className="text-gray-800 space-y-2 text-sm">
                    {post.caption && (
                      <p className="line-clamp-3">
                        <strong>📝</strong> {post.caption}
                      </p>
                    )}
                    <p><strong>📷 Type:</strong> {post.media_type}</p>
                    <p><strong>🕒</strong> {new Date(post.timestamp).toLocaleString()}</p>

                    <div className="flex justify-between items-center pt-2">
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF0035] font-semibold underline"
                      >
                        Voir sur Instagram
                      </a>
                      <div className="flex gap-4 text-sm text-gray-600 items-center">
                        {typeof post.like_count !== "undefined" && (
                          <span className="flex items-center gap-1">
                            <FaHeart className="text-red-500" /> {post.like_count}
                          </span>
                        )}
                        {typeof post.comments_count !== "undefined" && (
                          <span className="flex items-center gap-1">
                            <FaCommentDots className="text-blue-500" /> {post.comments_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* ➕ Carte pour ajouter une publication */}
              <div
                onClick={() => navigate("/publier")}
                className="cursor-pointer flex flex-col justify-center items-center bg-white rounded-2xl border-2 border-dashed border-[#FF0035] p-6 hover:bg-[#fff0f3] transition"
              >
                <FaPlus className="text-[#FF0035] text-4xl mb-2" />
                <p className="text-[#FF0035] font-semibold">Ajouter une publication</p>
              </div>
            </div>
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-600">Aucune publication trouvée.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Instagram;
