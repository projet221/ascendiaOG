import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import ConfigSocialMedia from "../../components/ConfigSocialMedia";

const All = () => {
  const [connected, setConnected] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
  });
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await axiosInstance.get(`/api/socialauth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        const connections = {
          facebook: data.some(item => item.provider === 'facebook'),
          instagram: data.some(item => item.provider === 'instagram'),
          twitter: data.some(item => item.provider === 'twitter'),
        };
        setConnected(connections);
      } catch (err) {
        console.error("Erreur lors de la récupération des réseaux connectés", err);
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
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-[#FF0035] mb-6 text-center">
            Mes Publications
          </h1>

          <div className="space-y-4 mb-6 max-w-3xl mx-auto">
            {reseaux.map((r) => (
              <div key={r.key} className="flex items-center gap-4 p-4 rounded-lg shadow bg-white">
                {r.icon}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{r.name}</span>
                  <span className={connected[r.key] ? "text-green-600" : "text-gray-500"}>
                    {connected[r.key] ? "Connecté" : "Non connecté"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              ➕ Ajouter un réseau
            </button>
          </div>
        </main>
      </div>

      {/* Modal ajout réseau */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ConfigSocialMedia />
          </div>
        </div>
      )}
    </div>
  );
};

export default All;
