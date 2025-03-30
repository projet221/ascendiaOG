import { useEffect, useState } from "react";
import BarreHaut from "../../components/BarreHaut";
import SidebarParametres from "../../components/SideBarParametres";
import { axiosInstance } from "../../utils/axios.jsx";

const MonCompte = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("user_id"); // tu dois stocker ça à la connexion
        const res = await axiosInstance.get(`/api/users/${userId}`);
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
      <div className="ml-64 mt-16">
        <div className="h-screen flex bg-gray-100 overflow-hidden">
          <div className="min-h-screen flex bg-gray-100 w-full justify-center items-start p-8">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-6">Informations du compte</h2>

              {userData ? (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold">Username :</label>
                    <p>{userData.username}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Email :</label>
                    <p>{userData.email}</p>
                  </div>

                </div>
              ) : (
                <p>Chargement des informations...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonCompte;
