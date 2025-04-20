import { useState, useEffect } from "react";
import BarreHaut from "../components/BarreHaut";
import { axiosInstance } from "../utils/axios.jsx";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { PieChart } from "react-minimal-pie-chart";

export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [postPlanifier, setPostPlanifier] = useState([]);
    const [recommandation, setRecommandation] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalEngagement, setTotalEngagement] = useState(0);
    const [totalPostsThisMonth, setTotalPostsThisMonth] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                console.warn("Token ou user_id manquant");
                setUsername("Non connecté");
                setIsLoading(false);
                return;
            }

            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const [
                    userResponse,
                    recommandationIA,
                    postsResp,
                    facebookResp,
                    instagramResp,
                ] = await Promise.all([
                    axiosInstance.get(`/api/users/${userId}`, { headers }),
                    axiosInstance.get(`/api/posts/recommandation/${userId}`, { headers }),
                    axiosInstance.get(`/api/posts/scheduled/${userId}`, { headers }),
                    axiosInstance.get(`/api/posts/facebook/posts/${userId}`, { headers }),
                    axiosInstance.get(`/api/posts/instagram/posts/${userId}`, { headers }),
                ]);

                // Utilisateur
                const userData = userResponse.data;
                setUsername(userData.username || "Utilisateur inconnu");

                // Recommandation IA
                setRecommandation(recommandationIA.data[0]?.contenu || "");

                // Posts planifiés
                setPostPlanifier(postsResp.data || []);

                // Engagement
                const facebookPosts = facebookResp.data || [];
                const instagramPosts = instagramResp.data || [];

                const engagementFacebook = facebookPosts.reduce((acc, post) => {
                    const likes = post.likes?.summary?.total_count || 0;
                    const comments = post.comments?.summary?.total_count || 0;
                    return acc + likes + comments;
                }, 0);

                const engagementInstagram = instagramPosts.reduce(
                    (acc, post) => acc + (post.like_count || 0) + (post.comments_count || 0),
                    0
                );

                setTotalEngagement(engagementFacebook + engagementInstagram);

                // Posts du mois
                const isThisMonth = (dateStr) => {
                    const date = new Date(dateStr);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                };

                const allPosts = [
                    ...facebookPosts.map((post) => ({ ...post, publishedAt: post.created_time })),
                    ...instagramPosts.map((post) => ({ ...post, publishedAt: post.timestamp })),
                ];

                const postsThisMonth = allPosts.filter((post) => isThisMonth(post.publishedAt));
                setTotalPostsThisMonth(postsThisMonth.length);

            } catch (error) {
                console.error("Erreur dans fetchData :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
    };

    const getPlatformIcon = (platform) => {
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
    };

    return (
        <div className="min-h-screen bg-pink-50">
            <BarreHaut />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <h1 className="text-3xl font-bold text-gray-700 mb-8">
                    Bonjour <span className="text-red-500">{username}</span>
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats principales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <StatCard label="Publications programmées" value={postPlanifier.length} />
                            <StatCard label="Publications ce mois" value={totalPostsThisMonth} />
                            <StatCard label="Engagement total" value={totalEngagement.toLocaleString()} />
                        </div>

                        {/* Graphiques et infos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <GraphCard />
                            <HashtagCard />
                            <RecommandationCard contenu={recommandation} />
                        </div>

                        {/* Posts planifiés */}
                        <div className="bg-white rounded-lg shadow p-6 mt-8">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Prochaines publications</h2>
                            {postPlanifier.length === 0 ? (
                                <p className="text-gray-500">Aucune publication planifiée pour le moment.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {[...postPlanifier]
                                        .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
                                        .map((post) => (
                                            <li key={post._id}>
                                                <div className="flex items-center gap-2">
                                                    {post.platform.map((p, i) => (
                                                        <span key={i}>{getPlatformIcon(p)}</span>
                                                    ))}
                                                    <span className="text-sm text-gray-500">— {formatDate(post.scheduledFor)}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm">{post.content}</p>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// === Composants internes ===

const StatCard = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-2">{label}</p>
        <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
);

const GraphCard = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📊 Réseaux les plus utilisés</h2>
        <div className="flex justify-center items-center h-48">
            <PieChart
                data={[
                    { title: "Instagram", value: 40, color: "#E1306C" },
                    { title: "Twitter", value: 30, color: "#1DA1F2" },
                    { title: "YouTube", value: 20, color: "#FF0000" },
                    { title: "Autres", value: 10, color: "#888888" },
                ]}
                animate
                label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value}%)`}
                labelStyle={{
                    fontSize: "5px",
                    fill: "#fff",
                }}
                radius={42}
                labelPosition={112}
            />
        </div>
    </div>
);

const HashtagCard = () => (
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
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Utiliser</button>
            <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">Analyser</button>
        </div>
    </div>
);

const RecommandationCard = ({ contenu }) => (
    <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">🤖 Recommandation du jour</h2>
        {contenu ? (
            <p className="text-gray-600 whitespace-pre-line">{contenu}</p>
        ) : (
            <p className="text-gray-400 italic">Aucune recommandation disponible pour le moment.</p>
        )}
    </div>
);
