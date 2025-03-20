import React from 'react';
import { useState } from 'react';

function SelectCompte(){

  const [selectedIds, setSelectedIds] = useState([]);

  const listeComptes = [
    { id: 1, name: 'Twitter' },
    { id: 2, name: 'Facebook' },
    { id: 3, name: 'Instagram' },
    { id: 4, name: 'LinkedIn' },
  ];

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
    

    return(
        <div>
                 <label htmlFor="account-select" className="block text-gray-700 mb-2">Sélectionnez des comptes :</label>
        <div className="flex space-x-4">
          {listeComptes.map((compte) => (
            <div
              key={compte.id}
              className={`p-3 cursor-pointer border rounded-md 
              ${selectedIds.includes(compte.id) ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'} 
              hover:bg-blue-50`}
              onClick={() => toggleSelect(compte.id)}
            >
              {compte.name}
              {selectedIds.includes(compte.id) && <span className="ml-2 text-blue-500">✅</span>}
            </div>
          ))}
        </div>
        </div>          
    );
};
export default SelectCompte;
