import React, { useState } from "react";
import Previsualisation from "./Previsualisation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
function bufferToBase64(bufferObj) {
    const byteArray = new Uint8Array(bufferObj.data);
    let binary = "";
    byteArray.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  }
export default function PostCarousel({ post, onDelete }) {
  // state for which platform we're on
  const [current, setCurrent] = useState(0);
  const platforms = post.platform;
  const platform = platforms[current];

  const next = () => setCurrent((c) => (c + 1) % platforms.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + platforms.length) % platforms.length);

  // your bufferToBase64 logic…
  const media = post.mediaFiles?.[0];
  const image =
    media && media.data
      ? `data:${media.contentType};base64,${bufferToBase64(media.data)}`
      : null;

  // assume these are your natural dimensions:
  const NATURAL = { w: 400, h: 400 };
  const DISPLAY = { w: 340, h: 400 };
  const scale = DISPLAY.w / NATURAL.w; // = 0.8

  return (
    <div className="w-full max-w-[500px] mb-6 border-b pb-4 flex flex-col items-center">
      {/* Platform name on top */}
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

        {/* fixed-size, scrollable, centered & scaled container */}
        <div className="relative w-80 h-[400px] border rounded-lg overflow-auto">
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: NATURAL.w,
              height: NATURAL.h,
              transform: "translateX(-50%) scale(...)",
                 transformOrigin: "top center"
            }}
          >
            <Previsualisation
              platform={platform}
              text={post.content}
              image={image}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <button
          onClick={next}
          className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <IoIosArrowForward />
        </button>
      </div>

      <button
        onClick={() => onDelete(post._id)}
        className="mt-4 px-3 py-1 bg-red-600 rounded-md text-white hover:bg-red-700 text-sm"
      >
        Supprimer
      </button>
    </div>
  );
}
