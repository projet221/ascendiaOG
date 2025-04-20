import { useEffect, useState } from "react";
import {
    MdThumbUp,
    MdFavorite,
    MdMood,
    MdChatBubbleOutline,
    MdShare} from "react-icons/md";import { axiosInstance } from "../utils/axios.jsx";

function Previsualisation({ platform, text, image }) {
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/api/socialAuth/${userId}`);
                console.log("debug previsualisation, data recu : ", response.data);

                // Trouver les informations en fonction du réseau social (platform)
                const socialData = response.data.find(auth => auth.provider.toLowerCase() === platform.toLowerCase());

                if (socialData) {
                    const { profile } = socialData;
                    // Extraire le bon username et image en fonction du provider
                    setUsername(profile.username || "");
                    setProfilePic(profile.photo || "/default-avatar.png"); // Fournir une valeur par défaut pour l'image
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des infos utilisateur :", err.message);
            }
        };

        fetchUserData();
    }, [platform]);

    const renderInstagram = () => (
        <div className="max-w-md w-full bg-white border border-gray-300 rounded-md shadow mb-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={profilePic || "/default-avatar.png"}
                        alt="profil"
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="font-semibold text-sm">{username}</span>
                </div>
                <span className="text-xl text-gray-500">⋯</span>
            </div>

            {/* Image */}
            {image && <img src={image} alt="post" className="w-full max-h-[500px] object-cover" />}

            {/* Boutons actions */}
            <div className="flex items-center justify-between px-4 pt-4 text-xl">
                <div className="flex gap-4">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>📤</span>
                </div>
                <span>🔖</span>
            </div>

            {/* Likes + texte */}
            <div className="px-4 py-2">
                <p className="text-sm font-semibold">32 j’aime</p>
                <p className="text-sm">
                    <span className="font-semibold mr-1">{username}</span>
                    <span className="whitespace-pre-wrap">{text}</span>
                </p>
            </div>
        </div>
    );

    const renderX = () => (
        <div className="max-w-md border rounded-xl shadow p-4 bg-white mb-4">
            <div className="flex items-start gap-3 mb-2">
                <img
                    src={profilePic || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <span className="font-bold">{username}</span>{" "}
                    <span className="text-gray-400">@{username.toLowerCase()}</span>
                    <p className="mt-1 whitespace-pre-wrap">{text}</p>
                    {image && (
                        <img src={image} alt="preview" className="w-full rounded-lg mt-2" />
                    )}
                    <div className="text-gray-400 text-sm mt-2">💬 🔁 ❤️</div>
                </div>
            </div>
        </div>
    );

    const renderFacebook = () => (

        <div className="max-w-md w-full bg-white border border-gray-300 rounded-md shadow mb-6">
            {/* Header : avatar + nom + date */}
            <div className="relative p-4 pb-2">
                <div className="flex items-start gap-3">
                    <img
                        src={profilePic || "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex flex-col">
          <span className="font-semibold text-sm text-blue-600 leading-none">
            {username || "Page / Profil"}
          </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
            {/* Exemple : “maintenant · globe” */}
                            maintenant <i className="material-icons text-[14px] align-middle">public</i>
          </span>
                    </div>
                </div>
                {/* menu 3 points */}
                <span className="absolute right-4 top-4 text-xl text-gray-500">⋯</span>
            </div>

            {/* Texte du post */}
            {text && (
                <p className="px-4 whitespace-pre-wrap mb-2 text-sm">
                    {text}
                </p>
            )}

            {/* Visuel (optionnel) */}
            {image && (
                <img
                    src={image}
                    alt="post"
                    className="w-full max-h-[500px] object-cover"
                />
            )}

            {/* Réactions (likes) + commentaires / partages */}
            <div className="flex items-center gap-1">
                <MdThumbUp  className="text-blue-600" />
                <MdFavorite className="text-red-600" />
                <MdMood     className="text-blue-600" />
                <span>123</span>
            </div>

            {/* Barre Like / Comment / Share */}
            {[
                { Icon: MdThumbUp,           label: "J’aime"     },
                { Icon: MdChatBubbleOutline, label: "Commenter"  },
                { Icon: MdShare,             label: "Partager"   }
            ].map(({ Icon, label }) => (
                <button key={label} className="flex items-center gap-1 w-full justify-center py-2 hover:bg-gray-100">
                    <Icon className="text-base" />
                    {label}
                </button>
            ))}
        </div>
    );

    const renderMap = {
        instagram: renderInstagram,
        x: renderX,
        facebook: renderFacebook,
        };

        const renderFunction = renderMap[platform?.toLowerCase()] || renderX;
        return renderFunction();
    }

export default Previsualisation;
