import React from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart,
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#FF0035", "#00C49F", "#0088FE"];

const performanceData = [
  { name: "Instagram", posts: 120, engagement: 2400 },
  { name: "Facebook", posts: 95, engagement: 1800 },
  { name: "Twitter", posts: 80, engagement: 1100 },
];

const globalComparison = [
  { name: "Instagram", value: 2400 },
  { name: "Facebook", value: 1800 },
  { name: "Twitter", value: 1100 },
];

const StatistiquesContent = () => {
  return (
    <div className="space-y-12">

      {/* Barres par réseau */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📊 Nombre de publications & Engagement par réseau
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
      </div>

      {/* Comparatif global - camembert */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          🥇 Part des réseaux en engagement global
        </h2>
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
      </div>

      {/* Courbe de croissance fictive */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          📈 Croissance des publications (fictive sur 7 jours)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={[
              { day: "Lun", Instagram: 10, Facebook: 5, Twitter: 3 },
              { day: "Mar", Instagram: 14, Facebook: 6, Twitter: 5 },
              { day: "Mer", Instagram: 13, Facebook: 7, Twitter: 4 },
              { day: "Jeu", Instagram: 16, Facebook: 8, Twitter: 6 },
              { day: "Ven", Instagram: 18, Facebook: 9, Twitter: 7 },
              { day: "Sam", Instagram: 20, Facebook: 12, Twitter: 9 },
              { day: "Dim", Instagram: 22, Facebook: 13, Twitter: 10 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Instagram" stroke="#FF0035" />
            <Line type="monotone" dataKey="Facebook" stroke="#00C49F" />
            <Line type="monotone" dataKey="Twitter" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatistiquesContent;
