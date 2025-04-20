import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.jsx";

/** Sélecteur de comptes (et pages Facebook) */
function SelectCompte({ setNetworks, setInfoComptes }) {
    const [listeComptes, setListeComptes]   = useState([]);    // [{ id, name, provider }]
    const [facebookPages, setFacebookPages] = useState({});    // { idCompte: [ {id,name}, … ] }
    const [selectedIds, setSelectedIds]     = useState([]);    // ids cochés / pages choisies


    useEffect(() => {
        const fetchSocial = async () => {
            const token  = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");
            if (!token || !userId) return;

            try {
                const { data } = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                /* 1) Construit la map pages Facebook puis la liste des comptes  */
                const pagesMap   = {};
                const comptesArr = data.map((item, idx) => {
                    if (item.provider === "facebook") {
                        pagesMap[idx] = item.pages || [];
                    }
                    return { id: idx, name: item.provider, provider: item.provider };
                });

                setFacebookPages(pagesMap);   // un seul setState
                setListeComptes(comptesArr);
            } catch (err) {
                console.error("Erreur fetch socialAuth :", err);
            }
        };
        fetchSocial();
    }, []);


    useEffect(() => {
        const selected = listeComptes
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.name);                      // ["facebook", "twitter", …]
        setNetworks(selected);
    }, [selectedIds, listeComptes, setNetworks]);


    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handlePageSelect = (compteId, pageId) => {
        setInfoComptes(prev => ({ ...prev, [compteId]: pageId }));
        if (!selectedIds.includes(compteId)) setSelectedIds(prev => [...prev, compteId]);
    };


    return (
        <div>
            <label className="block text-gray-700 text-lg mb-2">
                Sélectionnez des comptes :
            </label>

            <div className="flex flex-wrap gap-4">
                {listeComptes.map(compte => (
                    <div
                        key={compte.id}
                        className="p-3 border rounded-md bg-white border-gray-300 hover:bg-blue-50"
                    >
                        {/* Si Facebook → affiche la liste de pages */}
                        {compte.provider === "facebook" && facebookPages[compte.id]?.length ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pages Facebook :
                                </label>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1"
                                    onChange={e => handlePageSelect(compte.id, e.target.value)}
                                >
                                    <option value="">-- Sélectionnez une page --</option>
                                    {facebookPages[compte.id].map(pg => (
                                        <option key={pg.id} value={pg.id}>{pg.name}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            /* Autres réseaux → simple bouton toggle */
                            <div
                                className={`cursor-pointer ${
                                    selectedIds.includes(compte.id) ? "bg-blue-100 border-blue-500" : ""
                                }`}
                                onClick={() => toggleSelect(compte.id)}
                            >
                                {compte.name}
                                {selectedIds.includes(compte.id) && (
                                    <span className="ml-2 text-blue-500">✅</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectCompte;
