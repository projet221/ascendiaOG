import { useState } from "react";
import { Paperclip } from "lucide-react"; // Icône stylée (si tu utilises Lucide ou Heroicons)

const AjoutFichierBouton = ({ gestionFichier }) => {
  const [fichierSelectionne, setFichierSelectionne] = useState(null);

  const changeFichier = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFichierSelectionne(file);
      gestionFichier(file);
    }
  };

  return (
    <div className="relative w-fit">
      {/* Label stylisé comme bouton */}
      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 px-4 py-3 bg-[#FF0035] text-white font-medium rounded-lg cursor-pointer hover:bg-red-700 text-base"
      >
        <Paperclip className="w-5 h-5" /> {/* Icône 📎 moderne */}
        
      </label>

      {/* Input fichier caché */}
      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*"
        onChange={changeFichier}
        className="hidden"
      />

      {/* Nom du fichier sélectionné */}
      {fichierSelectionne && (
        <p className="mt-2 text-sm text-gray-700">
          {fichierSelectionne.name}
        </p>
      )}
    </div>
  );
};

export default AjoutFichierBouton;
