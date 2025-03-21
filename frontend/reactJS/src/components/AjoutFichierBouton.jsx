import { useState } from "react";

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
    <div className="cursor-pointer px-4 py-2 bg-[#FF0035] text-white rounded-md hover:bg-red-700 w-fit">
      <input 
        type="file" 
        accept="image/*,video/*" 
        onChange={changeFichier} 
        className="hidden"
        id="fileInput"
      />
      <label 
       htmlFor="fileInput" 
       className="cursor-pointer px-4 py-2 bg-[#FF0035] text-white rounded-md hover:bg-red-700 w-fit"
      >
      Sélectionner un fichier
    </label>
      {fichierSelectionne && <p className="text-sm text-gray-700">{fichierSelectionne.name}</p>}
    </div>
  );
};

export default AjoutFichierBouton;