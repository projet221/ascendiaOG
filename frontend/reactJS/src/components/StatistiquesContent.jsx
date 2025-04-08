import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      const API_URL = `${import.meta.env.VITE_PROXY_GATEWAY}/api/instagram/posts`;
      try {
        const res = await axios.get(API_URL);
        const posts = res.data || [];

        setInstagramPosts(posts);

        // Top like
        const topLiked = [...posts]
          .filter((p) => typeof p.like_count !== "undefined")
          .sort((a, b) => b.like_count - a.like_count)[0];
        setMostLiked(topLiked);

        // Top comment
        const topCommented = [...posts]
          .filter((p) => typeof p.comments_count !== "undefined")
          .sort((a, b) => b.comments_count - a.comments_count)[0];
        setMostCommented(topCommented);

        // Top engagement (like + comment)
        const topEngaging = [...posts]
          .filter(p => typeof p.like_count !== "undefined" && typeof p.comments_count !== "undefined")
          .sort((a, b) =>
            (b.like_count + b.comments_count) - (a.like_count + a.comments_count)
          )[0];
        setMostEngaging(topEngaging);
      } catch (error) {
        console.error("Erreur récupération des publications Instagram :", error);
      }
    };

    fetchInstagramPosts();
  }, []);

  const totalEngagement = instagramPosts.reduce(
    (acc, p) => acc + (p.like_count || 0) + (p.comments_count || 0),
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

  const renderPostCard = (post, title) => (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {["IMAGE", "CAROUSEL_ALBUM"].includes(post.media_type) ? (
        <img
          src={post.media_url || post.thumbnail_url}
          alt={post.caption || "Post Instagram"}
          className="w-full h-64 object-cover rounded-xl"
        />
      ) : post.media_type === "VIDEO" ? (
        <video controls className="w-full h-64 rounded-xl">
          <source src={post.media_url} type="video/mp4" />
        </video>
      ) : null}
      <p className="text-sm text-gray-600 line-clamp-3">{post.caption}</p>
      <div className="flex gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1 text-red-500">
          <FaHeart /> {post.like_count}
        </span>
        <span className="flex items-center gap-1 text-blue-500">
          <FaCommentDots /> {post.comments_count}
        </span>
      </div>
      <a
        href={post.permalink}
        target="_blank"
        rel="noreferrer"
        className="text-[#FF0035] text-sm underline"
      >
        Voir sur Instagram
      </a>
    </div>
  );

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
            {renderPostCard(mostEngaging, "🏆 Post avec le plus d'engagement (likes + commentaires)")}
          </div>
        )}
      </div>

      {/* Camembert */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          🥇 Répartition de l’engagement global
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

      {/* Courbe de croissance */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📈 Croissance fictive des publications Instagram (7 derniers jours)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={[
              { day: "Lun", Instagram: 10 },
              { day: "Mar", Instagram: 14 },
              { day: "Mer", Instagram: 13 },
              { day: "Jeu", Instagram: 16 },
              { day: "Ven", Instagram: 18 },
              { day: "Sam", Instagram: 20 },
              { day: "Dim", Instagram: 22 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Instagram" stroke="#FF0035" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top posts */}
      <div className="grid md:grid-cols-2 gap-6">
        {mostLiked && renderPostCard(mostLiked, "❤️ Post avec le plus de likes")}
        {mostCommented && renderPostCard(mostCommented, "💬 Post avec le plus de commentaires")}
      </div>
    </div>
  );
};

export default StatistiquesContent;
