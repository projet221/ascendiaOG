import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// Importez le composant ConfingsocialMedia (attention au chemin)
import ConfingsocialMedia from "../votreChemin/ConfingsocialMedia";

const BarreHaut = () => {
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const changeMenu = () => {
        setMenuOuvert(!menuOuvert);
    };

    const deconnexion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.location.reload();
        navigate("/login");
    };

    // Ouvrir / fermer la modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
                <div className="w-full flex h-16 items-center justify-between px-4">
                    {/* Logo à gauche */}
                    <NavLink to={"/"}>
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold" style={{ color: "#FF0035" }}>
                                Ascendia
                            </h1>
                        </div>
                    </NavLink>

                    {/* Menu centré */}
                    <div className="hidden sm:flex flex-1 justify-center">
                        <div className="flex space-x-6">
                            {[
                                { label: "Dashboard", to: "/dashboard" },
                                { label: "Publications", to: "/publications/all", base: "/publications" },
                                { label: "Planification", to: "/planification", base: "/planification" },
                                { label: "Statistiques", to: "/statistiques", base: "/statistiques" },
                            ].map(({ label, to, base }) => {
                                const isActive =
                                    label === "Dashboard"
                                        ? location.pathname === to
                                        : location.pathname.startsWith(base);

                                return (
                                    <NavLink
                                        key={label}
                                        to={to}
                                        className={`px-3 py-2 text-sm font-medium border-b-4 ${
                                            isActive
                                                ? "border-[#FF0035]"
                                                : "border-transparent hover:border-[#FF0035]"
                                        }`}
                                        style={{ color: "#FF0035" }}
                                    >
                                        {label}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>

                    {/* Boutons à droite */}
                    <div className="flex items-center gap-3">
                        {/* Bouton Publier (icône crayon) */}
                        <NavLink
                            to="/publications/new"
                            className="p-2 rounded-md"
                            style={{ backgroundColor: "#FF0035", color: "white" }}
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

                        {/* Nouveau bouton : lier un compte (icône) */}
                        <button
                            onClick={openModal}
                            className="p-2 rounded-md border"
                            style={{ borderColor: "#FF0035", color: "#FF0035" }}
                            title="Lier un compte"
                        >
                            {/* Remplacez l’icône par celle de votre choix */}
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>

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
                                    <button
                                        onClick={deconnexion}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal pour lier un compte */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    {/* Contenu de la modale */}
                    <div className="bg-white p-6 rounded shadow-lg">
                        {/* Votre composant ConfingsocialMedia */}
                        <ConfingsocialMedia />

                        {/* Bouton pour fermer la modale */}
                        <div className="mt-4 text-right">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded text-white"
                                style={{ backgroundColor: "#FF0035" }}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BarreHaut;
