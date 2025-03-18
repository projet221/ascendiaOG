import React from 'react';

function SelectCompte(){
    

    return(
        <div>
          <label htmlFor="account-select">Sélectionnez un compte :</label>
          <select id="account-select" multiple>
            {listeComptes.map(compte => (
              <option key={compte.id} value={compte.id}>
                {compte.name}
              </option>
            ))}
          </select>
        </div>          
    );
};
export default SelectCompte;
