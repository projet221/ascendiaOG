import { useEffect, useState } from "react";
import {
    MdThumbUp,
    MdOutlineChatBubble,
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
                            maintenant <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm4.95 6.05C15.75 6.81 14.42 6 13 6c-1.3 0-2.53.51-3.45 1.35.61.36 1.3.62 2.02.73.35.05.72.08 1.09.09.83-.02 1.63-.15 2.37-.38.56.24 1.08.57 1.56.98.07-.18.13-.36.18-.54.07-.25.12-.51.18-.77zm-3.84 2.96c-.63.12-1.26.18-1.89.16-.64 0-1.27-.06-1.89-.16-.44.74-.84 1.54-1.18 2.37.45.11.91.21 1.36.28.85.12 1.71.13 2.56.03.45-.07.9-.17 1.35-.29-.33-.82-.73-1.62-1.2-2.39zM4 12c0-.57.06-1.12.17-1.65.33.23.68.45 1.03.63.48.26 1 .48 1.55.64.4.12.8.21 1.21.28-.09.44-.14.9-.14 1.37 0 .48.05.94.15 1.39-.41.07-.82.16-1.22.27-.57.16-1.11.37-1.62.64-.35.18-.7.4-1.03.63C4.06 13.12 4 12.57 4 12zm8 8c-1.28 0-2.5-.31-3.58-.87.15-.26.31-.52.5-.76.38-.48.8-.92 1.25-1.3.27.06.54.1.81.13 1.24.15 2.52-.02 3.7-.52.12.3.24.6.37.89-.7.32-1.41.57-2.13.73-.3.07-.61.12-.91.17-.34.06-.69.09-1.03.09zm7.48-2.95c-.33-.23-.68-.45-1.03-.63-.48-.26-1-.48-1.55-.64-.4-.12-.8-.21-1.21-.28.09-.45.14-.91.14-1.38 0-.47-.05-.93-.15-1.38.41-.07.82-.16 1.22-.27.57-.16 1.11-.37 1.62-.64.35-.18.7-.4 1.03-.63.11.53.17 1.08.17 1.65s-.06 1.12-.17 1.65z"/></svg>
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
            <div className="flex justify-between border-t border-gray-200">
                {[
                    { Icon: MdThumbUp,           label: "J’aime" },
                    { Icon: MdOutlineChatBubble, label: "Commenter" },
                    { Icon: MdShare,             label: "Partager" }
                ].map(({ Icon, label }) => (
                    <button
                        key={label}
                        className="flex items-center gap-1 justify-center py-2 px-4 hover:bg-gray-100 flex-1"
                        /* ⇡  flex-1 → chacun prend 1/3 ;
                             retire‑le si tu préfères la largeur auto */
                    >
                        <Icon className="text-base" />
                        {label}
                    </button>
                ))}
            </div>
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
