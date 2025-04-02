import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.jsx";


function Previsualisation({ platform, text, image }) {
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
  
    useEffect(() => {
      const userId = localStorage.getItem("user_id");
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get(`/api/socialAuth/${userId}`);
          const { username, photo } = response.data.profile;
          setUsername(username);
          setProfilePic(photo);
        } catch (err) {
          console.error("Erreur lors de la récupération des infos utilisateur :", err.message);
        }
      };
  
      fetchUserData();
    }, []);

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
        <div className="max-w-md w-full bg-blue border border-gray-300 rounded-md shadow mb-6">
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

    const renderMap = {
        instagram: renderInstagram,
        x: renderX,
        facebook: renderFacebook,
      };
    
      const renderFunction = renderMap[platform?.toLowerCase()] || renderX;
      return renderFunction();
    }

    export default Previsualisation;
