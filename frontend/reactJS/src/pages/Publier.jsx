import React, {useState} from "react";
import SelectCompte from "../components/SelectCompte";

function Publier(){


    function publier(){

    }
    return (
        <div className="flex items-center justify-center">
            <div className="grid item-center bg-white ">
                <SelectCompte/>
            </div>
            <div>
                <textarea name="post" id="messagePost">Ecrivez message</textarea>
            </div>
            <label htmlFor="publish-select">Choisissez une action :</label>
            <select id="publish-select" value={action} onChange={publier()}>
                <option value="" disabled>-- Sélectionnez une option --</option>
                <option value="maintenant">Publier Maintenant</option>
                <option value="planifier">Planifier</option>
                <option value="brouillon">Enregistrer en brouillon</option>
            </select>
        </div>
    );
}
export default Publier;
