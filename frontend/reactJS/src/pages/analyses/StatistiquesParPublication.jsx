import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaCommentDots, FaArrowLeft } from "react-icons/fa";

export default function StatistiqueParPublication() {
    const location = useLocation();
    const navigate = useNavigate();
    const { postId, reseau, postData } = location.state || {};

    const [post, setPost] = useState(postData || null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_PROXY_GATEWAY}/api/posts/${reseau}/post/${postId}`);
                setPost(res.data);
            } catch (err) {
                setError("Erreur lors de la récupération de la publication.");
            }
        };

        const fetchComments = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_PROXY_GATEWAY}/api/posts/${reseau}/post/${postId}/comments`);
                const sorted = res.data.sort((a, b) => b.like_count - a.like_count);
                setComments(sorted);
            } catch (err) {
                console.error("Erreur récupération des commentaires", err);
            }
        };

        if (!post) fetchPost();
        if (postId && reseau) fetchComments();
    }, [postId, reseau]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!post) return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Bouton retour */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center text-sm text-gray-600 hover:text-[#FF0035] transition"
            >
                <FaArrowLeft className="mr-2" /> Retour
            </button>

            <h1 className="text-3xl font-bold text-center text-[#FF0035] mb-6">
                Statistiques de la publication
            </h1>

            {/* Image ou vidéo */}
            {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
                <img src={post.media_url} alt="Post" className="rounded-xl w-full max-h-[450px] object-cover" />
            ) : post.media_type === "VIDEO" ? (
                <video controls className="w-full rounded-xl max-h-[450px]">
                    <source src={post.media_url} type="video/mp4" />
                </video>
            ) : null}

            {/* Infos générales */}
            <div className="mt-6 text-gray-700 space-y-3">
                <p><strong>📝 Légende :</strong> {post.caption || "Aucune"}</p>
                <p><strong>📅 Date :</strong> {new Date(post.timestamp).toLocaleString()}</p>
                <div className="flex gap-6 text-lg mt-2">
          <span className="flex items-center gap-2 text-red-500">
            <FaHeart /> {post.like_count || 0}
          </span>
                    <span className="flex items-center gap-2 text-blue-500">
            <FaCommentDots /> {post.comments_count || 0}
          </span>
                </div>
                {post.permalink && (
                    <a
                        href={post.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF0035] font-medium underline block mt-2"
                    >
                        Voir sur Instagram
                    </a>
                )}
            </div>

            {/* Commentaires triés */}
            {comments.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">💬 Commentaires les plus likés</h2>
                    <ul className="space-y-4">
                        {comments.map((c, i) => (
                            <li key={i} className="bg-white rounded-lg p-4 shadow border-l-4 border-[#FF0035]">
                                <p className="text-gray-800">{c.text}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    ❤️ {c.like_count} like(s) — <span className="italic">{c.username}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
