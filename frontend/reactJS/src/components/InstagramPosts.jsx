import BarreHaut from "./BarreHaut";
import SidebarPublication from "./SideBarPublication";

const InstagramPosts = () => {
  return (
    <div>
      <BarreHaut />
      <div className="flex">
        <SidebarPublication />
        <main className="flex-1 ml-64 mt-16 p-6">
          <h1 className="text-2xl font-bold text-center text-[#FF0035]">
            Publications Instagram
          </h1>
          <p className="text-center text-gray-500 mt-4">Ici s’afficheront les posts liés à Instagram.</p>
        </main>
      </div>
    </div>
  );
};

export default InstagramPosts;
