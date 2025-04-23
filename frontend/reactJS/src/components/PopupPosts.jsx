
import React, { useState,useEffect } from "react";
import Previsualisation from "./Previsualisation";
import { axiosInstance } from "../utils/axios.jsx";
function bufferToBase64(bufferObj) {
    const byteArray = new Uint8Array(bufferObj.data);
    let binary = "";
    byteArray.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  }

const PopupPosts = ({ isOpen, onClose, posts, date }) => {
    if (!isOpen) return null; // si isOpen est nul la popup ne s'ouvre pas
    const [datePosts,setDatePosts] = useState(
        posts.filter((element)=>
        element.scheduledFor.split("T")[0] === date //on ne garde que les posts dont la date de publication programmé est celle de la cellule
    ));
    const deletePost = async (id)=>{
        try {
                const res = await axiosInstance.delete(`/api/posts/${id}`);
                console.log(res);
               window.location.reload();                
              } catch (err) {
                console.error("Erreur suppression du post :", err);
              } 

    }
    console.log("la date",datePosts);
    console.log("les posts",posts);
    console.log("la date de la cellule",date);
    //console.log("datePosts 0",datePosts[0].scheduledFor);
    //console.log(datePosts[0].scheduledfor.split("T")[0]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-[80vh] w-[600px] overflow-y-auto flex flex-col items-center">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-xl"
        >
          &times;
        </button>

        {datePosts.map((post, index) => {
  const media = post.mediaFiles?.[0];
  const image =
    media && media.data
      ? `data:${media.contentType};base64,${bufferToBase64(media.data)}`
      : null;

  // State pour suivre la plateforme affichée
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const platforms = post.platform;
  const currentPlatform = platforms[currentPlatformIndex];

  // Handlers de navigation
  const nextPlatform = () => {
    setCurrentPlatformIndex((prev) => (prev + 1) % platforms.length);
  };

  const prevPlatform = () => {
    setCurrentPlatformIndex((prev) =>
      (prev - 1 + platforms.length) % platforms.length
    );
  };

  return (
    <div key={index} className="w-full max-w-[500px] mb-6 border-b pb-4 flex flex-col items-center">
      {/* Boutons de navigation */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={prevPlatform}
          className="text-xl bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
        >
          ◀
        </button>
        <span className="font-semibold">{currentPlatform.toUpperCase()}</span>
        <button
          onClick={nextPlatform}
          className="text-xl bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
        >
          ▶
        </button>
      </div>

      {/* Prévisualisation de la plateforme courante */}
      <Previsualisation
        platform={currentPlatform}
        text={post.content}
        image={image}
      />

      <button
        onClick={() => deletePost(post._id)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm mt-4"
      >
        Supprimer
      </button>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default PopupPosts;