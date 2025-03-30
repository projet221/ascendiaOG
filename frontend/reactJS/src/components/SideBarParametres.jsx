import { NavLink } from "react-router-dom";

const SidebarParametres = () => {
  return (
    <aside className="fixed top-16 left-0 h-full w-64 bg-white border-r shadow">
      <div className="flex flex-col p-6 space-y-4">
        <NavLink
          to="/parametres/moncompte"
          className={({ isActive }) =>
            `text-[#FF0035] px-4 py-2 rounded-md border-b-4 text-base font-medium ${
              isActive ? "border-[#FF0035]" : "border-transparent hover:border-[#FF0035]"
            }`
          }
        >
          Mon Compte
        </NavLink>
        <NavLink
          to="/parametres/mesreseaux"
          className={({ isActive }) =>
            `text-[#FF0035] px-4 py-2 rounded-md border-b-4 text-base font-medium ${
              isActive ? "border-[#FF0035]" : "border-transparent hover:border-[#FF0035]"
            }`
          }
        >
          Mes Réseaux
        </NavLink>
      </div>
    </aside>
  );
};

export default SidebarParametres;
