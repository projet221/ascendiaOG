// Fichier : StatistiquesGlobales.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FaHeart, FaCommentDots, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

const KPIBlock = ({ icon: Icon, title, value }) => (
  <Card className="flex items-center justify-between p-4 shadow-md">
    <div className="text-2xl"><Icon /></div>
    <div className="text-right">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  </Card>
);

const StatistiquesGlobales = () => {
  const [data, setData] = useState({ instagram: [], facebook: [] });
  const [kpi, setKpi] = useState({ likes: 0, comments: 0, posts: 0, engagement: 0 });
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");
      const proxy = import.meta.env.VITE_PROXY_GATEWAY;
      const [igRes, fbRes] = await Promise.all([
        axios.get(`${proxy}/api/posts/instagram/posts/${userId}`),
        axios.get(`${proxy}/api/posts/facebook/posts/${userId}`)
      ]);
      const ig = igRes.data || [];
      const fb = fbRes.data || [];
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
        engagement
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
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistiques Globales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIBlock icon={FaHeart} title="Total Likes" value={kpi.likes} />
        <KPIBlock icon={FaCommentDots} title="Total Comments" value={kpi.comments} />
        <KPIBlock icon={FaCalendarAlt} title="Total Posts" value={kpi.posts} />
        <KPIBlock icon={FaChartLine} title="Engagement Moyen" value={kpi.engagement} />
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
    </div>
  );
};

export default StatistiquesGlobales;
