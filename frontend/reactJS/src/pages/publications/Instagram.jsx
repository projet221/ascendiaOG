import { useState, useEffect } from "react";
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import { axiosInstance } from "../../utils/axios";

const Instagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get(`/api/posts/instagram/${userId}`);
        setPosts(res.data);
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
                <div key={index} className="bg-white rounded-lg shadow p-4">
                  <img
                    src={post.media_url || post.thumbnail_url}
                    alt="Post Instagram"
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                  <p className="text-sm text-gray-700 mb-2">
                    {post.caption ? post.caption.slice(0, 100) : "Aucune description."}
                  </p>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF0035] text-sm underline"
                  >
                    Voir sur Instagram
                  </a>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
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
