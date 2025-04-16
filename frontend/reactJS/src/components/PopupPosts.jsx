
import React, { useState,useEffect } from "react";
import Previsualisation from "./Previsualisation";
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
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-xl"
        >
          &times;
        </button>
        <p>bonsoir paris</p>
        {datePosts.map((post, index)=>(
            <Previsualisation
            key={index}
            platform={post.platform[0]|| post} // si tu n'as pas encore mis d'objet
            text={post.content}
            image={post.mediaFiles[0] ? URL.createObjectURL(post.mediaFiles[0]) : null}
            username={post.username || "JohnDoe"}
            profilePic={post.profilePic || "/default-avatar.png"}
          />
        ))
    }
      </div>
    </div>
  );
};

export default PopupPosts;