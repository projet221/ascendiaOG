
import React, { useState,useEffect } from "react";

const PopupPosts = ({ isOpen, onClose, posts, date }) => {
    const [datePosts,setDatePosts] = useState(
        posts.filter((element)=>{
        element.scheduledFor.split("T")[0] == date; //on ne garde que les posts dont la date de publication programmé est celle de la cellule
    }));
    console.log(datePosts);
  if (!isOpen) return null;
   useEffect(()=>{
    const res = posts.filter((element)=>{
        element.scheduledFor.split("T")[0] == date;
    });
   },[]); 
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
      </div>
    </div>
  );
};

export default PopupPosts;