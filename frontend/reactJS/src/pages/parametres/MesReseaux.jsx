import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import BarreHaut from "../../components/BarreHaut";
import SidebarParametres from "../../components/SideBarParametres";

const MesReseaux = () => {
  const [socials, setSocials] = useState({ facebook: false, instagram: false, twitter: false });

  useEffect(() => {
    const fetchSocials = async () => {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");
      try {
        const res = await axiosInstance.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSocials(res.data.socialAccounts || {});
      } catch (err) {
        console.error("Erreur lors de la récupération des réseaux", err);
      }
    };

    fetchSocials();
  }, []);

  const reseaux = [
    { name: "Facebook", key: "facebook", icon: <FaFacebook className="text-blue-600 text-3xl" /> },
    { name: "Instagram", key: "instagram", icon: <FaInstagram className="text-pink-500 text-3xl" /> },
    { name: "X (Twitter)", key: "twitter", icon: <FaTwitter className="text-black text-3xl" /> },
  ];

  return (
    <div>
      <BarreHaut/>
      <SidebarParametres/>
      <div className="ml-64 mt-16 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-6">🌐 Mes Réseaux Sociaux</h1>
      <div className="space-y-4">
        {reseaux.map((r) => (
          <div key={r.key} className="flex items-center gap-4 p-4 rounded-lg shadow bg-white">
            {r.icon}
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{r.name}</span>
              <span className={socials[r.key] ? "text-green-600" : "text-gray-500"}>
                {socials[r.key] ? "Connecté" : "Non connecté"}
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
};

export default MesReseaux;
