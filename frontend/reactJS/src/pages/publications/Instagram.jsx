import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";

const Instagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.warn("Données inattendues", res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6">
          <h1 className="text-2xl font-bold mb-4">Mes publications Instagram</h1>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow">
                  <img src={post.media_url} alt="post" className="w-full rounded" />
                  {post.caption && <p className="mt-2">{post.caption}</p>}
                  <a href={post.permalink} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                    Voir sur Instagram
                  </a>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Instagram;
