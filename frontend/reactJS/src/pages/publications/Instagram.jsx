
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import axios from "axios";
import { useEffect, useState } from "react";

function Instagram() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`;
    console.log("📡 Appel à :", URL); // ← pour voir la vraie URL utilisée

    axios.get(URL)
      .then(res => {
        console.log("✅ Données reçues :", res.data);
        setPosts(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur récupération Instagram :", err);
      });
  }, []);

  return (
    <div>
      <h2>📸 Publications Instagram</h2>
      {posts.length === 0 ? <p>Aucune publication.</p> :
        posts.map(post => (
          <div key={post.id}>
            <img src={post.media_url} alt="Post" />
            <p>{post.caption}</p>
          </div>
        ))
      }
    </div>
  );
}

export default Instagram;