import React, { useState } from "react";
import Previsualisation from "./Previsualisation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function bufferToBase64(bufferObj) {
  const byteArray = new Uint8Array(bufferObj.data);
  let binary = "";
  byteArray.forEach((byte) => (binary += String.fromCharCode(byte)));
  return window.btoa(binary);
}

export default function PostCarousel({ post, onDelete }) {
  const [current, setCurrent] = useState(0);
  const platforms = post.platform;
  const platform = platforms[current];

  const next = () => setCurrent((c) => (c + 1) % platforms.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + platforms.length) % platforms.length);

  const media = post.mediaFiles?.[0];
  const image =
    media && media.data
      ? `data:${media.contentType};base64,${bufferToBase64(media.data)}`
      : null;

  return (
    <div className="w-full max-w-[500px] mb-6 border-b pb-4 flex flex-col items-center">
      {/* Nom de la plateforme */}
      <h3 className="mb-2 text-lg font-semibold text-gray-700 uppercase">
        {platform}
      </h3>

      {/* Slider */}
      <div className="flex items-center justify-center w-full gap-4">
        <button
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <IoIosArrowBack />
        </button>

        {/* ← LE CONTENEUR FIXE CENTRÉ */}
        <div className="w-80 h-80 border rounded-lg overflow-auto flex items-center justify-center">
          <Previsualisation
            platform={platform}
            text={post.content}
            image={image}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <button
          onClick={next}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={() => onDelete(post._id)}
        className="mt-4 px-3 py-1 bg-red-600 rounded-md text-white hover:bg-red-700 text-sm"
      >
        Supprimer
      </button>
    </div>
  );
}
