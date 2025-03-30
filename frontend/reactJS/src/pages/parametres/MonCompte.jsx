import { useEffect, useState } from "react";
import BarreHaut from "../../components/BarreHaut";
import SidebarParametres from "../../components/SideBarParametres";
import { axiosInstance } from "../../utils/axios.jsx";
import { useNavigate } from "react-router-dom";

const MonCompte = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("user_id"); // tu dois stocker ça à la connexion
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/api/users/${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
            }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des infos utilisateur", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <BarreHaut />
      <SidebarParametres />
      <div className="ml-64 mt-16 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🧑‍💻 Mon Compte</h2>

          {userData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold">Username</label>
                  <p className="text-gray-800">{userData.username}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold">Email</label>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/parametres/modifierinfos")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition"
                >
                  ✏️ Modifier mes informations
                </button>

                <button
                  onClick={() => navigate("/parametres/modifiermotdepasse")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-medium py-2 px-4 rounded-xl transition"
                >
                  🔒 Changer mon mot de passe
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Chargement des informations...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonCompte;
