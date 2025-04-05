// src/pages/publications/InstagramPosts.jsx

import { useEffect, useState } from "react";
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import { axiosInstance } from "../../utils/axios";

const InstagramPosts = () => {
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
        setError("Impossible de charger les publications Instagram.");
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
          <h1 className="text-3xl font-bold text-[#FF0035] mb-6 text-center">
            Publications Instagram
          </h1>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <div key={idx} className="bg-white rounded shadow p-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post Instagram"
                        className="w-full h-64 object-cover rounded mb-4"
                      />
                    )}
                    <p className="text-gray-800">{post.caption || "Aucune description."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">Aucun post Instagram disponible.</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default InstagramPosts;
