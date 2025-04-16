
import React, { useState,useEffect } from "react";
import Previsualisation from "./Previsualisation";

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
    console.log("la date",datePosts);
    console.log("les posts",posts);
    console.log("la date de la cellule",date);
    //console.log("datePosts 0",datePosts[0].scheduledFor);
    //console.log(datePosts[0].scheduledfor.split("T")[0]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-[80vh] w-[600px] overflow-y-auto">

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

  return (
    <Previsualisation
      key={index}
      platform={post.platform[0] || post}
      text={post.content}
      image={image}
    />
  );
})}

      </div>
    </div>
  );
};

export default PopupPosts;