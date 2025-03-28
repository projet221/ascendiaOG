import React from "react";
import { NavLink } from "react-router-dom";
import "./../index.css"; // Assurez-vous que Tailwind est bien importé ici

const HomePage = () => {
    return (
      <div className="relative min-h-screen overflow-hidden flex flex-col text-white">
        {/* Fond animé combiné */}
        <div className="absolute inset-0 -z-10 bg-animated"></div>
        <div className="absolute inset-0 -z-10 flex justify-center items-center">
          <div className="blob1"></div>
          <div className="blob2"></div>
          <div className="bubbles">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="bubble"></span>
            ))}
          </div>
        </div>
  
        {/* Barre de navigation */}
        <nav className="flex justify-between items-center p-6 relative z-10">
          <h1 className="text-3xl font-extrabold text">Ascendia</h1>
          <div className="space-x-4">
          <NavLink
            to="/login"
            className="px-5 py-2 text-[#FF0035] border border-[#FF0035] rounded-lg hover:bg-[#FF0035] hover:text-white transition font-semibold bg-white"
            >
            Connexion
            </NavLink>

            <NavLink
              to="/register"
            className="px-5 py-2 bg-[#FF0035] text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
            Inscription
            </NavLink>
          </div>
        </nav>
  
        {/* Section de présentation */}
        <main className="flex-grow flex items-center justify-center text-center px-4 relative z-10">
          <div>
            <h2 className="text-5xl font-extrabold text-white mb-6">
              Bienvenue sur <span className="text">Ascendia</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Gérez tous vos réseaux sociaux au même endroit, programmez vos publications, suivez vos performances, et boostez votre communauté en toute simplicité.</p>
            
            <p className="text-sm text-white-400 mt-4">Compatible avec Instagram, Facebook, Twitter, TikTok, et bien plus.</p>
            <div className="flex justify-center gap-6 mt-4  text-2xl">
              <i className="fab fa-instagram"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-x-twitter"></i>
              <i className="fab fa-tiktok"></i>
            </div>
            </div>
        </main>
      </div>
    );
  };
  
export default HomePage;
