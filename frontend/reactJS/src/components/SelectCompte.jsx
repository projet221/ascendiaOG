import { useEffect, useState } from 'react';
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({ networks, setNetworks, setInfoComptes }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [facebookPages, setFacebookPages] = useState({}); // stocker les pages par id de compte

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

                const comptes = data.map((item, index) => {
                    const id = index; // Id fictif ici
                    if (item.provider === "facebook") {
                        setFacebookPages(prev => ({
                            ...prev,
                            [id]: item.pages || []
                        }));
                    }
                    return {
                        id,
                        name: item.provider,
                        provider: item.provider
                    };
                });

                setListeComptes(comptes);

            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
            }
        };
        fetchSocial();
    }, []);

    useEffect(() => {
        const selectedNetworks = listeComptes
        .filter(compte => selectedIds.includes(compte.id))
        .map(compte => compte.name);
        setNetworks(selectedNetworks);
    }, [selectedIds]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handlePageSelect = (compteId, pageId) => {
        // ici, on peut propager cette info si nécessaire
        console.log(`Page sélectionnée pour le compte ${compteId} : ${pageId}`);
        setInfoComptes(prev => ({
            ...prev,
            [compteId]: pageId
        }));
        if (!selectedIds.includes(compteId)) {
            setSelectedIds(prev => [...prev, compteId]);
        }
    };

    return (
        <div>
            <label htmlFor="account-select" className="block text-gray-700 text-lg mb-2">Sélectionnez des comptes :</label>
            <div className="flex flex-wrap gap-4">
                {listeComptes.map((compte) => (
                    <div key={compte.id} className="p-3 border rounded-md bg-white border-gray-300 hover:bg-blue-50">
                        {compte.provider === "facebook" && facebookPages[compte.id] ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pages Facebook :</label>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1"
                                    onChange={(e) => handlePageSelect(compte.id, e.target.value)}
                                >
                                    <option value="">-- Sélectionnez une page --</option>
                                    {facebookPages[compte.id].map((page) => (
                                        <option key={page.id} value={page.id}>{page.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div
                                className={`cursor-pointer 
                                ${selectedIds.includes(compte.id) ? 'bg-blue-100 border-blue-500' : ''}`}
                                onClick={() => toggleSelect(compte.id)}
                            >
                                {compte.name}
                                {selectedIds.includes(compte.id) && <span className="ml-2 text-blue-500">✅</span>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectCompte;
