import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({ setNetworks, setInfoComptes }) {
    const [listeComptes, setListeComptes] = useState([]);
    const [facebookPages, setFacebookPages] = useState({});
    const [fbSelectedPage, setFbSelectedPage] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        const fetchSocial = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");
            if (!token || !userId) return;

            try {
                const { data } = await axiosInstance.get(`/api/socialAuth/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const pagesMap = {};
                const comptesArr = data.map((item, idx) => {
                    if (item.provider === "facebook") {
                        pagesMap[idx] = item.pages || [];
                    }
                    return { id: idx, provider: item.provider };
                });

                setFacebookPages(pagesMap);
                setListeComptes(comptesArr);
            } catch (err) {
                console.error("Erreur fetch socialAuth :", err);
            }
        };
        fetchSocial();
    }, []);

    useEffect(() => {
        const nets = listeComptes
            .filter(c => selectedIds.includes(c.id))
            .map(c => c.provider);
        setNetworks?.(nets);
    }, [selectedIds, listeComptes, setNetworks]);

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handlePageSelect = (compteId, pageId) => {
        setFbSelectedPage(prev => ({ ...prev, [compteId]: pageId }));

        if (!pageId) {
            setSelectedIds(prev => prev.filter(id => id !== compteId));
            setInfoComptes?.(prev => {
                const copy = { ...prev };
                delete copy[compteId];
                return copy;
            });
            return;
        }

        setInfoComptes?.(prev => ({ ...prev, [compteId]: pageId }));
        setSelectedIds(prev => (prev.includes(compteId) ? prev : [...prev, compteId]));
    };

    const getIcon = (provider) => {
        switch (provider) {
            case "facebook": return <FaFacebook className="text-blue-600 text-2xl" />;
            case "instagram": return <FaInstagram className="text-pink-500 text-2xl" />;
            case "twitter": return <FaTwitter className="text-blue-400 text-2xl" />;
            default: return provider;
        }
    };

    return (
        <div>
            <label className="block text-gray-700 text-lg mb-2">
                Sélectionnez des comptes :
            </label>

            <div className="flex flex-wrap gap-4">
                {listeComptes.map(compte => {
                    const isFacebook = compte.provider === "facebook";
                    const hasPages = facebookPages[compte.id]?.length > 0;
                    const isSelected = selectedIds.includes(compte.id) || (isFacebook && fbSelectedPage[compte.id]);

                    return (
                        <div
                            key={compte.id}
                            className={`p-3 rounded-md cursor-pointer border transition-all duration-200 ${
                                isSelected ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "bg-white border-gray-300 hover:shadow"
                            }`}
                            onClick={() => {
                                if (isFacebook && !isSelected) {
                                    setSelectedIds(prev => [...prev, compte.id]);
                                } else if (!isFacebook) {
                                    toggleSelect(compte.id);
                                }
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {getIcon(compte.provider)}
                            </div>

                            {isFacebook && hasPages && isSelected && (
                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">Pages Facebook :</label>
                                    <select
                                        className="border border-gray-300 rounded px-2 py-1"
                                        value={fbSelectedPage[compte.id] ?? ""}
                                        onChange={(e) => handlePageSelect(compte.id, e.target.value)}
                                    >
                                        <option value="">-- Sélectionnez une page --</option>
                                        {facebookPages[compte.id].map(pg => (
                                            <option key={pg.id} value={pg.id}>{pg.name}</option>
                                        ))}
                                    </select>
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