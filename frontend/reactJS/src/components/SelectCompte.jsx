import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({ setNetworks, setInfoComptes }) {
    /* ─────────────────────────────  states  ───────────────────────────── */
    const [listeComptes,      setListeComptes]   = useState([]); // [{id,provider}]
    const [facebookPages,     setFacebookPages]  = useState({}); // { idCompte: [ {id,name} ] }
    const [fbSelectedPage,    setFbSelectedPage] = useState({}); // { idCompte: pageId }
    const [selectedIds,       setSelectedIds]    = useState([]); // ids cochés

    /* ─────────────────────── 1) fetch des comptes ─────────────────────── */
    useEffect(() => {
        const fetchSocial = async () => {
            const token  = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");
            if (!token || !userId) return;

            try {
                const { data } = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const pagesMap   = {};
                const comptesArr = data.map((item, idx) => {
                    if (item.provider === "facebook") {
                        pagesMap[idx] = item.pages || [];
                    }
                    return { id: idx, provider: item.provider, name: item.provider };
                });

                setFacebookPages(pagesMap);
                setListeComptes(comptesArr);
            } catch (err) {
                console.error("Erreur fetch socialAuth :", err);
            }
        };
        fetchSocial();
    }, []);

    /* ─────────────── 2) recalcul networks quand sélection change ──────── */
    useEffect(() => {
        const nets = listeComptes
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.provider);
        setNetworks?.(nets);
    }, [selectedIds, listeComptes, setNetworks]);

    /* ───────────────────────────  helpers  ────────────────────────────── */
    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handlePageSelect = (compteId, pageId) => {
        /* a) on mémorise la page courante */
        setFbSelectedPage(prev => ({ ...prev, [compteId]: pageId }));

        /* b) option vide → on retire Facebook de la sélection */
        if (!pageId) {
            setSelectedIds(prev => prev.filter(id => id !== compteId));
            if (typeof setInfoComptes === "function") {
                setInfoComptes(prev => {
                    const copy = { ...prev };
                    delete copy[compteId];
                    return copy;
                });
            }
            return;
        }

        /* c) page réelle → on sélectionne / met à jour */
        if (typeof setInfoComptes === "function") {
            setInfoComptes(prev => ({ ...prev, [compteId]: pageId }));
        }
        setSelectedIds(prev => (prev.includes(compteId) ? prev : [...prev, compteId]));
    };

    /* ───────────────────────────  render  ────────────────────────────── */
    return (
        <div>
            <label className="block text-gray-700 text-lg mb-2">
                Sélectionnez des comptes :
            </label>

            <div className="flex flex-wrap gap-4">
                {listeComptes.map(compte => {
                    const isSelected = selectedIds.includes(compte.id);
                    const baseClass  =
                        "p-3 border rounded-md bg-white hover:bg-blue-50 " +
                        (isSelected ? "bg-blue-100 border-blue-500" : "border-gray-300");

                    return (
                        <div key={compte.id} className={baseClass}>
                            {/* ── Facebook : dropdown de pages ───────────────────────── */}
                            {compte.provider === "facebook" && facebookPages[compte.id]?.length ? (
                                <>
                                    <label className="block text-sm font-medium mb-1">
                                        Pages Facebook :
                                    </label>
                                    <select
                                        className="border border-gray-300 rounded px-2 py-1"
                                        value={fbSelectedPage[compte.id] ?? ""}
                                        onChange={e => handlePageSelect(compte.id, e.target.value)}
                                    >
                                        <option value="">-- Sélectionnez une page --</option>
                                        {facebookPages[compte.id].map(pg => (
                                            <option key={pg.id} value={pg.id}>{pg.name}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                /* ── Autres réseaux : simple toggle ──────────────────── */
                                <div
                                    className="cursor-pointer select-none"
                                    onClick={() => toggleSelect(compte.id)}
                                >
                                    {compte.name}
                                    {isSelected && (
                                        <span className="ml-2 text-blue-500">✅</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SelectCompte;
