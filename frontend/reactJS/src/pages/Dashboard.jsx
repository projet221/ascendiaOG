import { useState, useEffect } from "react";
import BarreHaut from "../components/BarreHaut"; // ou équivalent
// import { PieChart } from "react-minimal-pie-chart"; // Exemple si vous souhaitez un vrai camembert
// ↑ Vous pouvez utiliser la librairie de graph de votre choix (chart.js, rechart, etc.)

export default function Dashboard() {
    // Supposez que vous avez récupéré ce username d’une API
    const [username, setUsername] = useState("JeanDupont");

    useEffect(() => {
        // Ex: fetchUser() pour mettre à jour le username
    }, []);

    return (
        <div className="min-h-screen bg-pink-50">
            {/* BarreHaut : en-tête globale */}
            <BarreHaut />

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                {/* Titre de page : “Bonjour {username}” */}
                <h1 className="text-3xl font-bold text-gray-700 mb-8">
                    Bonjour <span className="text-red-500">{username}</span>
                </h1>

                {/* Première rangée : 3 stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 mb-2">Publications programmées</p>
                        <p className="text-3xl font-semibold text-gray-800">27</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 mb-2">Publications ce mois</p>
                        <p className="text-3xl font-semibold text-gray-800">163</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                        <p className="text-gray-500 mb-2">Engagement total</p>
                        <p className="text-3xl font-semibold text-gray-800">+2.5K</p>
                    </div>
                </div>

                {/* Deuxième rangée : 2 “cards” (le camembert + Hashtags, par exemple) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Card “Réseaux les plus utilisés” */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Réseaux les plus utilisés</h2>
                        {/* Exemple d’un camembert minimaliste en "fake" */}
                        <div className="flex justify-center items-center h-48">
                            <div className="bg-gray-100 w-40 h-40 rounded-full flex items-center justify-center">
                                <p className="text-sm text-gray-500">Camembert (ex)</p>
                            </div>
                        </div>
                        {/* Option : si vous voulez un vrai chart, utilisez par ex. react-minimal-pie-chart ou chart.js */}
                        {/*
            <PieChart
              data={[
                { title: 'Instagram', value: 40, color: '#E1306C' },
                { title: 'Twitter', value: 30, color: '#1DA1F2' },
                { title: 'YouTube', value: 20, color: '#FF0000' },
                { title: 'Autres', value: 10, color: '#888888' }
              ]}
            />
            */}
                    </div>

                    {/* Card “Hashtags Tendance” */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Hashtags Tendance</h2>
                        <p className="text-gray-600 mb-2">Top hashtags cette semaine</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Hashtags en mode “badge” */}
                            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-md text-sm">
                #valentinesDay
              </span>
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-sm">
                #Trump
              </span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">
                #marketing
              </span>
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-md text-sm">
                #tech
              </span>
                        </div>

                        {/* Quelques indicateurs */}
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">+62% Visibilité</p>
                                <p className="text-sm text-gray-700">par rapport à la semaine dernière</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">2.6K Utilisations</p>
                                <p className="text-sm text-gray-700">sur la dernière campagne</p>
                            </div>
                        </div>

                        {/* Quelques boutons d’actions */}
                        <div className="mt-4 flex gap-2">
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Utiliser
                            </button>
                            <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                                Analyser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Troisième rangée : par exemple “Prochaines publications” */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Prochaines publications</h2>
                    <ul className="space-y-4">
                        <li>
                            <p className="font-semibold text-gray-800">Facebook — demain à 15h00</p>
                            <p className="text-gray-600 text-sm">Rendez-vous le 15/07/2025 dans notre boutique</p>
                        </li>
                        <li>
                            <p className="font-semibold text-gray-800">Linkedin — demain à 15h00</p>
                            <p className="text-gray-600 text-sm">Rendez-vous le 15/07/2025 dans notre boutique</p>
                        </li>
                        <li>
                            <p className="font-semibold text-gray-800">Facebook — 15/07/2025 à 9h30</p>
                            <p className="text-gray-600 text-sm">Anniversaire de la marque</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
