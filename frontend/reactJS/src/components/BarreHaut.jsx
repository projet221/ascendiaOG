import { useState } from "react";
import { NavLink } from "react-router-dom"; 

const BarreHaut = () => {
  
  const [menuOuvert, setMenuOuvert] = useState(false);
  
    const changeMenu = () => {
      setMenuOuvert(!menuOuvert);
    };

    const deconnexion = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.reload();
    }
 
  return (
    <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
      <div className="w-full flex h-16 items-center justify-between px-4">
        {/* Logo à gauche */}
        <NavLink to={"/"}>
          <div className="flex items-center">
            <h1 className="text-xl font-bold" style={{ color: '#FF0035' }}>
              Ascendia
            </h1>
          </div>
        </NavLink>


        {/* Menu centré */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="flex space-x-6">
            {[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Publications", to: "/publications/all" },
              { label: "Planification", to: "/planification" },
              { label: "Statistiques", to: "/statistiques" },
            ].map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium border-b-4 ${
                    isActive
                      ? "border-[#FF0035]"
                      : "border-transparent hover:border-[#FF0035]"
                  }`
                }
                style={{ color: '#FF0035' }}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Boutons à droite */}
        <div className="flex items-center gap-3">
          {/* Bouton Publier */}
          <NavLink
            to="/publications/new"
            className="p-2 rounded-md"
            style={{
              backgroundColor: "#FF0035",
              color: "white",
            }}
            title="Publier"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 0 0 .707-.293l10-10a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0l-10 10A1 1 0 0 0 4 15.414V20z"
              />
            </svg>
          </NavLink>

          {/* Bouton Profil (icône user) */}
          <div className="relative">
            <button
              onClick={changeMenu}
              className="p-2 rounded-full border"
              style={{ borderColor: "#FF0035", color: "#FF0035" }}
              title="Profil"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9.004 9.004 0 0112 15c2.003 0 3.847.66 5.258 1.763M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Menu déroulant */}
            {menuOuvert && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md z-50">
                <NavLink
                  to="/parametres/moncompte"
                  onClick={() => setMenuOuvert(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Paramètres
                </NavLink>
                <NavLink
                  onClick={deconnexion}
                  className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                >
                  Déconnexion
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarreHaut;

