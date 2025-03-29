import { useState } from "react";
import { Paperclip, X } from "lucide-react"; 

const AjoutFichierBouton = ({ gestionFichier }) => {
  const [fichierSelectionne, setFichierSelectionne] = useState(null);

  const changeFichier = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFichierSelectionne(file);
      gestionFichier(file);
    }
  };

  const supprimerFichier = () => {
    setFichierSelectionne(null);
    gestionFichier(null);
  };

  return (
    <div className="relative w-fit">

      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 px-4 py-3 bg-[#FF0035] text-white font-medium rounded-lg cursor-pointer hover:bg-red-700 text-base"
      >
        <Paperclip className="w-5 h-5" />
        Ajouter un fichier
      </label>


      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*"
        onChange={changeFichier}
        className="hidden"
      />

      {fichierSelectionne && (
        <div className="mt-2 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
          <p className="text-sm text-gray-700">{fichierSelectionne.name}</p>
          <button
            onClick={supprimerFichier}
            className="text-red-500 hover:text-red-700"
            title="Supprimer le fichier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AjoutFichierBouton;
