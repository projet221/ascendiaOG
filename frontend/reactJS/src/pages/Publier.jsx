import React, {useState} from "react";
import SelectCompte from "../components/SelectCompte.jsx";
import AjoutFichierBouton from "../components/AjoutFichierBouton.jsx";
import BarreHaut from "../components/BarreHaut.jsx";

function Publier(){


    function publier(){

    }
    return (
        <div>
            <BarreHaut/>
        
                <div className="absolute left-0 top-11 w-1/2 h">
               
                    <div className="min-h-screen flex bg-gray-100">
                      <div className=" p-6">
                        <SelectCompte/>
                        <label htmlFor="message" className="block text-gray-700 mb-2">Votre message :</label>
                        <textarea
                         id="message"
                         className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                         rows="4"
                        ></textarea>
                       
                       <AjoutFichierBouton/>
        
            
                    <label htmlFor="publish-select">Choisissez une action :</label>
                    <select id="publish-select" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md" onChange={publier()}>
                        <option value="" disabled>-- Sélectionnez une option --</option>
                        <option value="maintenant">Publier Maintenant</option>
                        <option value="planifier">Planifier</option>
                        <option value="brouillon">Enregistrer en brouillon</option>
                    </select>
                </div>
                </div>
                </div>

                <div className="absolute right-0 top-0 w-1/2 h">
                <div className="min-h-screen flex bg-gray-100">
                    <h3>Prévisualisation : </h3>
                </div>
               </div>


                
        </div>
        
    );  
}
export default Publier;
