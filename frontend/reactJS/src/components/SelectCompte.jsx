import { useEffect, useState } from 'react';
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({networks,setNetworks,setInfoComptes}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    
    useEffect(() => {
        const fetchSocial = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            if (!token || !userId) {
                console.warn("Token ou user_id non trouvé, l'utilisateur n'est peut-être pas connecté.");
                return;
            }

            try {
                const response = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = response.data;
                console.warn("Données reçues :", data);

                // Mettre à jour l'état proprement
                const comptes = data.map((item, index) => ({
                    id: index,  // Remplace par un vrai identifiant unique si disponible
                    name: item.provider
                }));

                setListeComptes(comptes);

            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };
        fetchSocial();
    }, []);

    useEffect(()=>{
        const selectedNetworks = listeComptes
        .filter(compte => selectedIds.includes(compte.id))  // Récupère les comptes sélectionnés
        .map(compte => compte.name); 
        setNetworks(selectedNetworks);
    },[selectedIds]);


    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );

    };


    return (
        <div>
            <label htmlFor="account-select" className="block text-gray-700 text-lg mb-2">Sélectionnez des comptes :</label>
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
}

export default SelectCompte;
