import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({ setNetworks, setInfoComptes }) {
    const [listeComptes,   setListeComptes]   = useState([]);   // [{id, provider, name}]
    const [facebookPages,  setFacebookPages]  = useState({});   // { idCompte: [ {id,name} ] }
    const [selectedIds,    setSelectedIds]    = useState([]);   // comptes effectivement cochés

    /* ------------------------------------------------------------- */
    /* 1. Récupération des comptes sociaux                            */
    /* ------------------------------------------------------------- */
    useEffect(() => {
        const fetchSocial = async () => {
            const token  = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");
            if (!token || !userId) return;

            try {
                const { data } = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                /* Construit **d’abord** la map `pagesMap`, puis setState une seule fois */
                const pagesMap   = {};
                const comptesArr = data.map((item, idx) => {
                    if (item.provider === "facebook") {
                        pagesMap[idx] = item.pages || [];       // pages FB
                    }
                    return { id: idx, provider: item.provider, name: item.provider };
                });

                setFacebookPages(pagesMap);   // un seul setState
                setListeComptes(comptesArr);
            } catch (err) {
                console.error("Erreur fetch socialAuth :", err);
            }
        };
        fetchSocial();
    }, []);

    /* ------------------------------------------------------------- */
    /* 2. Chaque fois que sélection OU liste changent → networks     */
    /* ------------------------------------------------------------- */
    useEffect(() => {
        const nets = listeComptes
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.provider);              // ["facebook", "twitter", …]
        setNetworks(nets);
    }, [selectedIds, listeComptes, setNetworks]);

    /* ------------------------------------------------------------- */
    /* 3. Helpers                                                    */
    /* ------------------------------------------------------------- */
    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handlePageSelect = (compteId, pageId) => {
        if (!pageId) return; // -- Sélection vide --
        setInfoComptes(prev => ({ ...prev, [compteId]: pageId }));

        // ajoute le compte Facebook aux sélectionnés (si absent)
        setSelectedIds(prev => (prev.includes(compteId) ? prev : [...prev, compteId]));
    };

    /* ------------------------------------------------------------- */
    /* 4. Render                                                     */
    /* ------------------------------------------------------------- */
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
                        {/* cas Facebook => liste déroulante des pages */}
                        {compte.provider === "facebook" && facebookPages[compte.id]?.length ? (
                            <>
                                <label className="block text-sm font-medium mb-1">
                                    Pages Facebook :
                                </label>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1"
                                    onChange={e => handlePageSelect(compte.id, e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="">-- Sélectionnez une page --</option>
                                    {facebookPages[compte.id].map(pg => (
                                        <option key={pg.id} value={pg.id}>{pg.name}</option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            /* autres réseaux => simple toggle */
                            <div
                                className={`cursor-pointer ${
                                    selectedIds.includes(compte.id)
                                        ? "bg-blue-100 border-blue-500"
                                        : ""
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
