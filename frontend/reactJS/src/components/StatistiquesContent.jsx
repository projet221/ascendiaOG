import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart,
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaHeart, FaCommentDots } from "react-icons/fa";

const COLORS = ["#FF0035", "#00C49F", "#0088FE"];

const StatistiquesContent = () => {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [mostLiked, setMostLiked] = useState(null);
  const [mostCommented, setMostCommented] = useState(null);
  const [mostEngaging, setMostEngaging] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      setLoading(true);
      const API_URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/posts/instagram/posts/${localStorage.getItem('user_id')}`;
      try {
        const res = await axios.get(API_URL);
        const posts = res.data || [];
        
        console.log(`Récupération réussie: ${posts.length} publications`);
        
        if (posts.length === 0) {
          setError("Aucune publication Instagram trouvée");
          setLoading(false);
          return;
        }

        setInstagramPosts(posts);

        // Identification du post avec le plus de likes
        const postsWithLikes = posts.filter(p => 
          p && typeof p.like_count === "number" && p.like_count >= 0
        );
        
        console.log(`Posts avec likes valides: ${postsWithLikes.length}`);
        
        if (postsWithLikes.length > 0) {
          const topLiked = [...postsWithLikes].sort((a, b) => b.like_count - a.like_count)[0];
          console.log("Post avec le plus de likes:", topLiked);
          setMostLiked(topLiked);
        }

        // Identification du post avec le plus de commentaires
        const postsWithComments = posts.filter(p => 
          p && typeof p.comments_count === "number" && p.comments_count >= 0
        );
        
        console.log(`Posts avec commentaires valides: ${postsWithComments.length}`);
        
        if (postsWithComments.length > 0) {
          const topCommented = [...postsWithComments].sort((a, b) => b.comments_count - a.comments_count)[0];
          console.log("Post avec le plus de commentaires:", topCommented);
          setMostCommented(topCommented);
        }

        // Identification du post avec le plus d'engagement (likes + commentaires)
        const postsWithEngagement = posts.filter(p =>
          p && 
          typeof p.like_count === "number" && 
          typeof p.comments_count === "number"
        );

        if (postsWithEngagement.length > 0) {
          const topEngaging = [...postsWithEngagement].sort(
            (a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count)
          )[0];
          console.log("Post avec le plus d'engagement:", topEngaging);
          setMostEngaging(topEngaging);
        }

        // Données de croissance par date
        const postsByDate = {};
        posts.forEach((p) => {
          if (p && p.timestamp) {
            const date = new Date(p.timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
            postsByDate[date] = (postsByDate[date] || 0) + 1;
          }
        });

        const formattedGrowth = Object.entries(postsByDate)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, count]) => ({
            date,
            Instagram: count,
          }));

        setGrowthData(formattedGrowth);
        setLoading(false);
      } catch (error) {
        console.error("Erreur récupération des publications Instagram:", error);
        setError("Erreur lors de la récupération des publications Instagram");
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  // Calcul de l'engagement total seulement si les posts existent
  const totalEngagement = instagramPosts.reduce(
    (acc, p) => acc + (p && typeof p.like_count === "number" ? p.like_count : 0) 
              + (p && typeof p.comments_count === "number" ? p.comments_count : 0),
    0
  );

  const performanceData = [
    {
      name: "Instagram",
      posts: instagramPosts.length,
      engagement: totalEngagement,
    },
    {
      name: "Facebook",
      posts: 0,
      engagement: 0,
    },
    {
      name: "Twitter",
      posts: 0,
      engagement: 0,
    },
  ];

  const globalComparison = performanceData.map((p) => ({
    name: p.name,
    value: p.engagement,
  }));

  const renderPostCard = (post, title) => {
    if (!post) return null;
    
    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {post.media_type && ["IMAGE", "CAROUSEL_ALBUM"].includes(post.media_type) ? (
          <img
            src={post.media_url || post.thumbnail_url}
            alt={post.caption || "Post Instagram"}
            className="w-full h-64 object-cover rounded-xl"
          />
        ) : post.media_type === "VIDEO" ? (
          <video controls className="w-full h-64 rounded-xl">
            <source src={post.media_url} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Aperçu non disponible</p>
          </div>
        )}
        <p className="text-sm text-gray-600 line-clamp-3">{post.caption || "Sans légende"}</p>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1 text-red-500">
            <FaHeart /> {post.like_count || 0}
          </span>
          <span className="flex items-center gap-1 text-blue-500">
            <FaCommentDots /> {post.comments_count || 0}
          </span>
        </div>
        {post.permalink && (
          <a
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="text-[#FF0035] text-sm underline"
          >
            Voir sur Instagram
          </a>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700">Chargement des statistiques...</h2>
          <div className="mt-4 w-12 h-12 border-4 border-t-[#FF0035] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-red-500">Une erreur est survenue</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#FF0035] text-white rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-12 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#FF0035] mb-4 text-center">
        📈 Statistiques Réseaux Sociaux
      </h1>

      {/* Total posts */}
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          📸 Nombre total de publications Instagram
        </h2>
        <p className="text-4xl font-bold text-[#FF0035]">{instagramPosts.length}</p>
      </div>

      {/* Bar chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📊 Publications & Engagement par réseau
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="posts" fill="#FF0035" name="Publications" />
            <Bar dataKey="engagement" fill="#00C49F" name="Engagement" />
          </BarChart>
        </ResponsiveContainer>

        {/* Best post by engagement */}
        {mostEngaging && (
          <div className="mt-8">
            {renderPostCard(
              mostEngaging,
              "🏆 Post avec le plus d'engagement (likes + commentaires)"
            )}
          </div>
        )}
      </div>

      {/* Camembert */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          🥇 Répartition de l'engagement global
        </h2>
        {globalComparison.some((entry) => entry.value > 0) ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={globalComparison}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {globalComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500">Pas encore de données pour générer ce graphique.</p>
        )}
      </div>

      {/* Courbe de croissance réelle */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📆 Croissance réelle des publications Instagram
        </h2>
        {growthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Instagram" stroke="#FF0035" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-500">Aucune publication à afficher dans la courbe.</p>
        )}
      </div>

      {/* Top posts */}
      <div className="grid md:grid-cols-2 gap-6">
        {mostLiked ? 
          renderPostCard(mostLiked, "❤️ Post avec le plus de likes") : 
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">❤️ Post avec le plus de likes</h3>
            <p className="text-sm text-gray-500">Aucune publication avec des likes n'a été trouvée.</p>
          </div>
        }
        
        {mostCommented ? 
          renderPostCard(mostCommented, "💬 Post avec le plus de commentaires") : 
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">💬 Post avec le plus de commentaires</h3>
            <p className="text-sm text-gray-500">Aucune publication avec des commentaires n'a été trouvée.</p>
          </div>
        }
      </div>
    </div>
  );
};

export default StatistiquesContent;