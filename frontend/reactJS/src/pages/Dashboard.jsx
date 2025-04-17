import { useState, useEffect } from "react";
import BarreHaut from "../components/BarreHaut";
import { axiosInstance } from "../utils/axios.jsx";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { PieChart } from 'react-minimal-pie-chart'; // Librairie pour afficher un camembert (statistiques)

export default function Dashboard() {
    // Déclaration des états nécessaires
    const [username, setUsername] = useState(""); // Nom de l'utilisateur
    const [postPlanifier, setPostPlanifier] = useState([]); // Liste des publications planifiées
    const [recommandation, setRecommandation] = useState(""); // Recommandation IA
    const [isLoading, setIsLoading] = useState(true); // État de chargement
    const [totalEngagement, setTotalEngagement] = useState(0); // Engagement total
    const [totalPostsThisMonth, setTotalPostsThisMonth] = useState(0);


    // Effet de récupération des données lorsque le composant est monté
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupération du token et de l'ID utilisateur depuis le localStorage
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("user_id");

                // Si le token ou l'ID utilisateur est manquant, on arrête le processus
                if (!token || !userId) {
                    console.warn("Aucun token ou user_id trouvé, utilisateur non connecté.");
                    setUsername("Non connecté");
                    setIsLoading(false); // Fin du chargement
                    return;
                }

                // Récupération des données utilisateur (nom d'utilisateur)
                const userResponse = await axiosInstance.get(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const userData = userResponse.data;
                setUsername(userData.username || "Utilisateur inconnu");


                // Récupération de la recommandation de contenu par IA
                const recommandationIA = await axiosInstance.get(`/api/posts/recommandation/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecommandation(recommandationIA.data[0].contenu);

                // Récupération des publications planifiées
                const postsResp = await axiosInstance.get(`/api/posts/scheduled/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPostPlanifier(postsResp.data || []);

                
                

                // Récupération des posts Facebook et Instagram pour calculer l'engagement
                const [facebookResp, instagramResp] = await Promise.all([
                    axiosInstance.get(`/api/posts/facebook/posts/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axiosInstance.get(`/api/posts/instagram/posts/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                
                // Extraction des données
                const facebookPosts = facebookResp.data || [];
                const instagramPosts = instagramResp.data || [];
                
                console.log("Facebook posts:", facebookPosts);
                console.log("Instagram posts:", instagramPosts);


                // Calcul de l'engagement total : somme des likes + commentaires
                const engagementFacebook = facebookPosts.reduce((acc, post) => {
                    const likes = post.likes?.summary?.total_count || 0;
                    const comments = post.comments?.summary?.total_count || 0;
                    return acc + likes + comments;
                }, 0);
                
                const engagementInstagram = instagramPosts.reduce((acc, post) => acc + (post.like_count || 0) + (post.comments_count || 0), 0);
                
                setTotalEngagement(engagementFacebook + engagementInstagram);
                // Marquer la fin du chargement
                setIsLoading(false);

            } catch (error) {
                console.error("Erreur lors de la récupération des infos :", error);
                setIsLoading(false); // Marquer le chargement comme terminé même en cas d'erreur
            }
        };

        fetchData(); // Appel de la fonction pour récupérer les données
    }, []);

    // Fonction pour formater la date au format souhaité
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${
            (date.getMonth() + 1).toString().padStart(2, '0')}/${
            date.getFullYear()} ${
            date.getHours().toString().padStart(2, '0')}:${
            date.getMinutes().toString().padStart(2, '0')}`;
    }

    // Fonction pour obtenir l'icône d'un réseau social basé sur son nom
    function getPlatformIcon(platform) {
        switch (platform) {
            case "facebook":
                return <FaFacebook className="text-blue-600 text-lg" />;
            case "instagram":
                return <FaInstagram className="text-pink-500 text-lg" />;
            case "twitter":
                return <FaTwitter className="text-blue-400 text-lg" />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-pink-50">
            {/* BarreHaut : en-tête globale */}
            <BarreHaut />

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                {/* Titre de page : “Bonjour {username}” */}
                <h1 className="text-3xl font-bold text-gray-700 mb-8">
                    Bonjour <span className="text-red-500">{username}</span>
                </h1>

                {/* Affichage du spinner si les données sont en cours de chargement */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Première rangée : 3 stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 mb-2">Publications programmées</p>
                                <p className="text-3xl font-semibold text-gray-800">{postPlanifier.length}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 mb-2">Publications ce mois</p>
                                <p className="text-3xl font-semibold text-gray-800">163</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
                                <p className="text-gray-500 mb-2">Engagement total</p>
                                <p className="text-3xl font-semibold text-gray-800">{totalEngagement.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Deuxième rangée : graphiques et informations supplémentaires */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {/* Card “Réseaux les plus utilisés” */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-700 mb-4">📊 Réseaux les plus utilisés</h2>
                                <div className="flex justify-center items-center h-48">
                                    <PieChart
                                        data={[
                                            { title: 'Instagram', value: 40, color: '#E1306C' },
                                            { title: 'Twitter', value: 30, color: '#1DA1F2' },
                                            { title: 'YouTube', value: 20, color: '#FF0000' },
                                            { title: 'Autres', value: 10, color: '#888888' }
                                        ]}
                                        animate
                                        label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value}%)`}
                                        labelStyle={{
                                            fontSize: '5px',
                                            fill: '#fff',
                                        }}
                                        radius={42}
                                        labelPosition={112}
                                    />
                                </div>
                            </div>

                            {/* Card “Hashtags Tendance” */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-700 mb-4">🔥 Hashtags Tendance</h2>
                                <p className="text-gray-600 mb-2">Top hashtags cette semaine</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-md text-sm">#valentinesDay</span>
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-sm">#Trump</span>
                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md text-sm">#marketing</span>
                                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-md text-sm">#tech</span>
                                </div>
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
                                <div className="mt-4 flex gap-2">
                                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                        Utiliser
                                    </button>
                                    <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                                        Analyser
                                    </button>
                                </div>
                            </div>

                            {/* Card “Recommandation IA” */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-700 mb-4">🤖 Recommandation du jour</h2>
                                {recommandation ? (
                                    <p className="text-gray-600 whitespace-pre-line">{recommandation}</p>
                                ) : (
                                    <p className="text-gray-400 italic">Aucune recommandation disponible pour le moment.</p>
                                )}
                            </div>
                        </div>

                        {/* Troisième rangée : Prochaines publications */}
                        <div className="bg-white rounded-lg shadow p-6 mt-8">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Prochaines publications</h2>
                            {/* Si pas de posts planifiés */}
                            {postPlanifier.length === 0 && (
                                <p className="text-gray-500">Aucune publication planifiée pour le moment.</p>
                            )}

                            {/* Sinon, on liste */}
                            <ul className="space-y-4">
                                {[...postPlanifier]
                                .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
                                .map((post) => (
                                    <li key={post._id}>
                                        <div className="flex items-center gap-2">
                                            {post.platform.map((p, idx) => (
                                                <span key={idx}>{getPlatformIcon(p)}</span>
                                            ))}
                                            <span className="text-sm text-gray-500">— {formatDate(post.scheduledFor)}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">{post.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
