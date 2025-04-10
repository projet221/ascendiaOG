import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaCommentDots, FaPlus } from "react-icons/fa";

import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";

const Facebook = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFacebookPosts = async () => {
    const API_URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/posts/facebook/posts`;
    console.log("📡 Requête Facebook envoyée à :", API_URL);

    try {
      const res = await axios.get(API_URL);
      console.log("Publications Facebook reçues :", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("Erreur récupération Facebook :", err);
      setError("Erreur lors du chargement des publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacebookPosts();
  }, []);

  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-100 min-h-screen">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
            🌐 Publications Facebook
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
                  {post.full_picture && (
                    <img
                      src={post.full_picture}
                      alt="Facebook post"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                  )}

                  <div className="text-gray-800 space-y-2 text-sm">
                    {post.message && (
                      <p className="line-clamp-4">
                        <strong>📝</strong> {post.message}
                      </p>
                    )}
                    <p>
                      <strong>🕒</strong> {new Date(post.created_time).toLocaleString()}
                    </p>

                    <div className="flex justify-between items-center pt-2">
                      <a
                        href={post.permalink_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-semibold underline"
                      >
                        Voir sur Facebook
                      </a>
                      <div className="flex gap-4 text-sm text-gray-600 items-center">
                        {post.likes?.summary?.total_count >= 0 && (
                          <span className="flex items-center gap-1">
                            <FaHeart className="text-red-500" /> {post.likes.summary.total_count}
                          </span>
                        )}
                        {post.comments?.summary?.total_count >= 0 && (
                          <span className="flex items-center gap-1">
                            <FaCommentDots className="text-blue-500" /> {post.comments.summary.total_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* ➕ Ajouter une publication */}
              <div
                onClick={() => navigate("/publier")}
                className="cursor-pointer flex flex-col justify-center items-center bg-white rounded-2xl border-2 border-dashed border-blue-600 p-6 hover:bg-blue-50 transition"
              >
                <FaPlus className="text-blue-600 text-4xl mb-2" />
                <p className="text-blue-600 font-semibold">Ajouter une publication</p>
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

export default Facebook;
