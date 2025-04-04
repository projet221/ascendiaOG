import { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import SidebarPublication from "../../components/SideBarPublication.jsx";
import BarreHaut from "../../components/BarreHaut.jsx";

// Logos des réseaux
const logos = {
  twitter: "/logos/x.png",
  facebook: "/logos/facebook.png",
  instagram: "/logos/insta.png",
};

const All = () => {
  const [reseaux, setReseaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchReseaux = async () => {
      try {
        const response = await axiosInstance.get(`/api/socials/connected/${userId}`);
        setReseaux(response.data);
      } catch (err) {
        setError("Impossible de récupérer les réseaux connectés.");
      } finally {
        setLoading(false);
      }
    };

    fetchReseaux();
  }, []);

  return (
    <div>
      <BarreHaut />

      <div className="flex">
        <SidebarPublication />

        <main className="flex-1 ml-64 mt-16 p-6">
          {/* Titre principal */}
          <h1 className="text-3xl font-bold text-[#FF0035] mb-6 text-center">
            Mes Publications
          </h1>

          {loading && <p className="text-gray-500">Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Réseaux connectés */}
              {reseaux.map((reseau, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded shadow-sm hover:shadow-md transition"
                >
                  {/* Logo réseau */}
                  <img
                    src={logos[reseau.provider]}
                    alt={reseau.provider}
                    className="w-10 h-10 object-contain"
                  />

                  {/* Infos utilisateur */}
                  <div>
                    <p className="font-semibold capitalize">{reseau.provider}</p>
                    <p className="text-sm text-gray-600">@{reseau.profile?.username || "Nom inconnu"}</p>
                  </div>

                  {/* Photo de profil */}
                  {reseau.profile?.photo && (
                    <img
                      src={reseau.profile.photo}
                      alt="avatar"
                      className="w-10 h-10 rounded-full ml-auto"
                    />
                  )}
                </div>
              ))}

              {/* Carte Ajouter un réseau */}
              <div
                className="flex flex-col justify-center items-center p-4 border-2 border-dashed border-[#FF0035] rounded hover:shadow-md transition cursor-pointer"
                onClick={() => console.log("Ajouter un réseau")} // Action à définir plus tard
              >
                <div className="w-10 h-10 rounded-full bg-[#FF0035] text-white flex items-center justify-center text-2xl">
                  +
                </div>
                <p className="mt-2 text-sm text-[#FF0035] font-medium">Ajouter un réseau</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default All;
