import { useState,useEffect } from "react";
import SelectCompte from "../components/SelectCompte.jsx";
import AjoutFichierBouton from "../components/AjoutFichierBouton.jsx";
import BarreHaut from "../components/BarreHaut.jsx";
import SidebarPublication from "../components/SideBarPublication.jsx";
import { axiosInstance } from "../utils/axios";

function Publier() {
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));
    const [networks, setNetworks] = useState([]);
    const [action, setAction] = useState(""); // État pour gérer l'action choisie
    const [fichier,setFichier] = useState(null);
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleActionChange = (e) => {
        setAction(e.target.value); // Mettre à jour l'action choisie
    };

    const publier = async () => {
        if (!message || !networks.length) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        try {
            const formData = new FormData();

        // Ajouter les autres données du formulaire
            formData.append("userId", userId);
            formData.append("networks", JSON.stringify(networks));
            formData.append("message", message);

            if(fichier){
                formData.append("file", fichier);
            }
            console.log("le formdata file",formData.file);
            const response = await axiosInstance.post(
                "/api/posts",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = await response.data;
            if(response.data){
            console.log("Post publié avec succès :", data);
            }
            //window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la publication :", err.message);
        }
    };
    useEffect(()=>{
        console.log("le fichier",fichier);
    },[fichier]);

    return (
        <div>
            <BarreHaut />
            <SidebarPublication />

            <div className="ml-64 mt-16 p-6">
                <div className="min-h-screen flex bg-gray-100">
                    <div className="p-6">
                        <SelectCompte networks={networks} setNetworks={setNetworks} />
                        <label htmlFor="message" className="block text-gray-700 mb-2">
                            Votre message :
                        </label>
                        <textarea
                            id="message"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            rows="4"
                            value={message}
                            onChange={handleMessageChange}
                        ></textarea>
                        <AjoutFichierBouton gestionFichier={setFichier}/>
                        <label htmlFor="publish-select">Choisissez une action :</label>
                        <select
                            id="publish-select"
                            className="bg-[#FF0035] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md w-fit mt-4"
                            value={action}  // Ajout de la valeur contrôlée pour le select
                            onChange={handleActionChange}
                        >
                            <option value="" disabled>
                                -- Sélectionnez une option --
                            </option>
                            <option value="maintenant">Publier Maintenant</option>
                            <option value="planifier">Planifier</option>
                            <option value="brouillon">Enregistrer en brouillon</option>
                        </select>
                        <button
                            onClick={publier} // Appeler publier au clic
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                        >
                            Publier
                        </button>
                    </div>
                </div>
            </div>
            {/*<div className="absolute right-0 top-0 w-1/2 h">
                <div className="min-h-screen flex bg-gray-100">
                    <h3>Prévisualisation : </h3>
                </div>
            </div>*/}
        </div>
    );
}

export default Publier;
