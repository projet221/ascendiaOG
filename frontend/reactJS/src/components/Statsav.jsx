

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaInstagram, FaFacebookSquare, FaRegImages, FaFilter, FaFileExport } from "react-icons/fa";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

const StatistiquesAvancees = () => {
  const [data, setData] = useState({ instagram: [], facebook: [] });
  const [platform, setPlatform] = useState("instagram");
  const [filtered, setFiltered] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [engagementTimeline, setEngagementTimeline] = useState([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      const proxy = import.meta.env.VITE_PROXY_GATEWAY;
      const [igRes, fbRes] = await Promise.all([
        axios.get(`${proxy}/api/posts/instagram/posts/${userId}`),
        axios.get(`${proxy}/api/posts/facebook/posts/${userId}`)
      ]);
      setData({ instagram: igRes.data || [], facebook: fbRes.data || [] });
    };
    fetchData();
  }, []);

  useEffect(() => {
    let posts = data[platform];

    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      posts = posts.filter(p => {
        const date = new Date(p.timestamp || p.created_time);
        return date >= start && date <= end;
      });
    }

    const filteredPosts = posts.map(post => {
      const date = new Date(post.timestamp || post.created_time);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const type = post.media_type || (post.full_picture ? "image" : "autre");
      const likes = post.like_count || post.likes?.summary?.total_count || 0;
      const comments = post.comments_count || post.comments?.summary?.total_count || 0;
      return {
        id: post.id,
        type,
        month,
        engagement: likes + comments,
        caption: post.caption || post.message,
        image: post.media_url || post.full_picture,
        link: post.permalink || post.permalink_url
      };
    });

    const filteredByType = mediaTypeFilter === "all"
      ? filteredPosts
      : filteredPosts.filter(p => p.type === mediaTypeFilter);

    const types = {};
    const monthly = {};
    filteredByType.forEach(p => {
      types[p.type] = (types[p.type] || 0) + 1;
      if (!monthly[p.month]) monthly[p.month] = { month: p.month, engagement: 0 };
      monthly[p.month].engagement += p.engagement;
    });

    setFiltered(filteredByType);
    setTypeDistribution(Object.entries(types).map(([key, value]) => ({ name: key, value })));
    setEngagementTimeline(Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month)));
  }, [platform, data, mediaTypeFilter, dateRange]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stats_${platform}.json`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques Avancées</h1>

      <div className="flex flex-wrap gap-4 items-end">
        <button onClick={() => setPlatform("instagram")} className={`px-4 py-2 rounded ${platform === "instagram" ? "bg-pink-500 text-white" : "bg-gray-200"}`}><FaInstagram className="inline mr-2" />Instagram</button>
        <button onClick={() => setPlatform("facebook")} className={`px-4 py-2 rounded ${platform === "facebook" ? "bg-blue-600 text-white" : "bg-gray-200"}`}><FaFacebookSquare className="inline mr-2" />Facebook</button>

        <div>
          <label className="text-sm text-gray-600 block">Type de contenu</label>
          <select className="p-2 border rounded" value={mediaTypeFilter} onChange={e => setMediaTypeFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Vidéo</option>
            <option value="CAROUSEL_ALBUM">Carrousel</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block">Date début</label>
          <input type="date" className="p-2 border rounded" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-gray-600 block">Date fin</label>
          <input type="date" className="p-2 border rounded" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
        </div>

        <button onClick={exportJSON} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaFileExport /> Export JSON
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Engagement par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Répartition par type de contenu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {typeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Contenu le plus performant</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.sort((a, b) => b.engagement - a.engagement).slice(0, 6).map(post => (
            <div key={post.id} className="border rounded overflow-hidden shadow-sm">
              {post.image && <img src={post.image} alt="post" className="w-full h-48 object-cover" />}
              <div className="p-4">
                <p className="font-semibold text-sm mb-2">Engagement : {post.engagement}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{post.caption}</p>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline mt-2 inline-block">Voir le post</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatistiquesAvancees;
