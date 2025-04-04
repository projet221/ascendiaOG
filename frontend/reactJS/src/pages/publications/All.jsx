import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import BarreHaut from "../../components/BarreHaut";
import SidebarPublication from "../../components/SideBarPublication";
import ConfigSocialMedia from "../../components/ConfigSocialMedia";

const All = () => {
  const [socials, setSocials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem("user_id");

  const reseauxIcons = {
    facebook: <FaFacebook className="text-blue-600 text-3xl" />,
    instagram: <FaInstagram className="text-pink-500 text-3xl" />,
    twitter: <FaTwitter className="text-black text-3xl" />,
  };

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await axiosInstance.get(`/api/socials/connected/${userId}`);
        setSocials(res.data); // tableau avec provider + profile
      } catch (err) {
        console.error("Erreur lors de la récupération des réseaux connectés", err);
      }
    };

    fetchSocials();
  }, []);

  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-[#FF0035] mb-6 text-center">
            Mes Publications
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socials.map((reseau, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg shadow bg-white"
              >
                {reseauxIcons[reseau.provider]}
                <div className="flex flex-col">
                  <span className="text-lg font-semibold capitalize">{reseau.provider}</span>
                  <span className="text-sm text-gray-600">@{reseau.profile?.username}</span>
                </div>
                {reseau.profile?.photo && (
                  <img
                    src={reseau.profile.photo}
                    alt="avatar"
                    className="w-10 h-10 rounded-full ml-auto"
                  />
                )}
              </div>
            ))}

            {/* Ajouter un réseau */}
            <div
              onClick={() => setShowModal(true)}
              className="flex flex-col justify-center items-center p-4 border-2 border-dashed border-[#FF0035] rounded hover:shadow-md transition cursor-pointer bg-white"
            >
              <div className="w-10 h-10 rounded-full bg-[#FF0035] text-white flex items-center justify-center text-2xl">
                +
              </div>
              <p className="mt-2 text-sm text-[#FF0035] font-medium">Ajouter un réseau</p>
            </div>
          </div>
        </main>
      </div>

      {/* Modal d'ajout de réseau */}
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
