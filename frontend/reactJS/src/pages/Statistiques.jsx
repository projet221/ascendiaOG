import BarreHaut from "../components/BarreHaut";
import SidebarPublication from "../components/SideBarPublication";
import StatistiquesContent from "../components/StatistiquesContent";

const Statistiques = () => {
  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
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
