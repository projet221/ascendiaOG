import { useEffect, useState } from 'react';
import axios from 'axios';

const InstagramPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`)

      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de récupération des posts:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Chargement...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded shadow">
          {(post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") && (
            <img src={post.media_url} alt="Instagram" className="w-full rounded mb-2" />
          )}
          {post.media_type === "VIDEO" && (
            <video controls className="w-full mb-2">
              <source src={post.media_url} type="video/mp4" />
            </video>
          )}
          {post.caption && <p className="text-sm mb-1">{post.caption}</p>}
          <a href={post.permalink} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">
            Voir sur Instagram
          </a>
        </div>
      ))}
    </div>
  );
};

export default InstagramPosts;
