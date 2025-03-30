import { useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import BarreHaut from "../../components/BarreHaut";
import SidebarParametres from "../../components/SideBarParametres";

const ModifierMotDePasse = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.put(`/api/users/${userId}/password`, { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Mot de passe mis à jour !");
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
      <h1 className="text-xl font-bold mb-6">Changer mon mot de passe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nouveau mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Changer</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default ModifierMotDePasse;
