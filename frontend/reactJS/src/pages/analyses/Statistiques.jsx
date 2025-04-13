import BarreHaut from "../../components/BarreHaut.jsx";
import StatistiquesContent from "../../components/StatistiquesContent.jsx";
import SidebarStatisque from "../../components/SideBarstatistique.jsx";

const Statistiques = () => {
  return (
    <div>
      <BarreHaut />
        <SidebarStatisque/>
      <div className="flex">

        <main className="flex-1 ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold text-[#FF0035] mb-6 text-center">
            Statistiques
          </h1>
          <StatistiquesContent />
        </main>
      </div>
    </div>
  );
};

export default Statistiques;
