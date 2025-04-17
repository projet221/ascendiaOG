// Fichier : StatistiquesGlobales.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaHeart, FaCommentDots, FaCalendarAlt, FaChartLine, FaStar } from "react-icons/fa";

const KPIBlock = ({ icon: Icon, title, value }) => (
  <div className="bg-white shadow rounded p-4 flex justify-between items-center">
    <div className="text-2xl"><Icon /></div>
    <div className="text-right">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  </div>
);

const COLORS = ["#FF6384", "#36A2EB"];

const StatistiquesGlobales = () => {
  const [data, setData] = useState({ instagram: [], facebook: [] });
  const [kpi, setKpi] = useState({ likes: 0, comments: 0, posts: 0, engagement: 0 });
  const [timeline, setTimeline] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [platformDistribution, setPlatformDistribution] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      const proxy = import.meta.env.VITE_PROXY_GATEWAY;
      const [igRes, fbRes] = await Promise.all([
        axios.get(`${proxy}/api/posts/instagram/posts/${userId}`),
        axios.get(`${proxy}/api/posts/facebook/posts/${userId}`)
      ]);

      let ig = igRes.data || [];
      let fb = fbRes.data || [];

      // Filtrage par date
      if (dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        ig = ig.filter(post => new Date(post.timestamp) >= start && new Date(post.timestamp) <= end);
        fb = fb.filter(post => new Date(post.created_time) >= start && new Date(post.created_time) <= end);
      }

      setData({ instagram: ig, facebook: fb });

      const igLikes = ig.reduce((a, b) => a + (b.like_count || 0), 0);
      const fbLikes = fb.reduce((a, b) => a + (b.likes?.summary?.total_count || 0), 0);
      const igComments = ig.reduce((a, b) => a + (b.comments_count || 0), 0);
      const fbComments = fb.reduce((a, b) => a + (b.comments?.summary?.total_count || 0), 0);
      const posts = ig.length + fb.length;
      const engagement = posts ? ((igLikes + fbLikes + igComments + fbComments) / posts).toFixed(2) : 0;

      setKpi({
        likes: igLikes + fbLikes,
        comments: igComments + fbComments,
        posts,
        engagement,
        instagramPosts: ig.length,
        facebookPosts: fb.length
      });

      const timelineMap = {};
      const mapPost = (post, dateField, src) => {
        const date = new Date(post[dateField]);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!timelineMap[month]) timelineMap[month] = { month, instagram: 0, facebook: 0 };
        timelineMap[month][src]++;
      };

      ig.forEach(post => mapPost(post, "timestamp", "instagram"));
      fb.forEach(post => mapPost(post, "created_time", "facebook"));

      setTimeline(Object.values(timelineMap).sort((a, b) => a.month.localeCompare(b.month)));

      const allPosts = [...ig, ...fb];
      const top = allPosts.reduce((max, post) => {
        const likes = post.like_count || post.likes?.summary?.total_count || 0;
        const comments = post.comments_count || post.comments?.summary?.total_count || 0;
        const engagement = likes + comments;
        return engagement > max.engagement ? { ...post, engagement } : max;
      }, { engagement: 0 });

      setTopPost(top);

      setPlatformDistribution([
        { name: "Instagram", value: ig.length },
        { name: "Facebook", value: fb.length }
      ]);
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques Globales</h1>

      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de début</label>
          <input type="date" className="border rounded p-2" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de fin</label>
          <input type="date" className="border rounded p-2" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBlock icon={FaHeart} title="Total Likes" value={kpi.likes} />
        <KPIBlock icon={FaCommentDots} title="Total Comments" value={kpi.comments} />
        <KPIBlock icon={FaCalendarAlt} title="Total Posts" value={kpi.posts} />
        <KPIBlock icon={FaChartLine} title="Engagement Moyen" value={kpi.engagement} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <KPIBlock icon={FaCalendarAlt} title="Posts Instagram" value={kpi.instagramPosts || 0} />
        <KPIBlock icon={FaCalendarAlt} title="Posts Facebook" value={kpi.facebookPosts || 0} />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Comparatif d'engagement par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="instagram" fill="#FF6384" name="Instagram" />
            <Bar dataKey="facebook" fill="#36A2EB" name="Facebook" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Timeline d'activité</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="instagram" stroke="#FF6384" name="Instagram" />
            <Line type="monotone" dataKey="facebook" stroke="#36A2EB" name="Facebook" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md">
        <h2 className="font-semibold mb-4">Répartition des publications par plateforme</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={platformDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {platformDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {topPost && (
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><FaStar className="text-yellow-400" /> Post le plus performant</h2>
          <div className="flex flex-col md:flex-row items-start gap-4">
            {topPost.media_url || topPost.full_picture ? (
              <img src={topPost.media_url || topPost.full_picture} alt="Top Post" className="w-full md:w-64 rounded" />
            ) : null}
            <div>
              <p className="font-semibold">Engagement : {topPost.engagement}</p>
              <p className="text-gray-600 mt-2">{topPost.caption || topPost.message || "Aucune description"}</p>
              <a
                href={topPost.permalink || topPost.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
              >
                Voir le post
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatistiquesGlobales;
