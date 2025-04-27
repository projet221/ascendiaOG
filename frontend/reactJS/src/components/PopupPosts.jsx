import React, { useState, useEffect } from "react";
import PostCarousel from "./PostCarousel";
import { axiosInstance } from "../utils/axios.jsx";

export default function PopupPosts({ isOpen, onClose, posts, date }) {
  if (!isOpen) return null;

  const datePosts = posts.filter(
    (p) => p.scheduledFor.split("T")[0] === date
  );

  const deletePost = async (id) => {
    await axiosInstance.delete(`/api/posts/${id}`);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative w-[600px] max-h-[80vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-xl"
        >
          &times;
        </button>

        {datePosts.map((post) => (
          <PostCarousel
            key={post._id}
            post={post}
            onDelete={deletePost}
          />
        ))}
      </div>
    </div>
  );
}
