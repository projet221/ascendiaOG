import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import BarreHaut from "../../components/BarreHaut";
import SidebarParametres from "../../components/SideBarParametres";

const ModifierInfos = () => {
  const [formData, setFormData] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ username: res.data.username, email: res.data.email });
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(`/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Informations mises à jour !");
      navigate("/parametres/mon-compte");
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div>
    <BarreHaut />
    <SidebarParametres />
    <div className="ml-64 mt-16 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-xl font-bold mb-6">Modifier mes informations</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default ModifierInfos;
