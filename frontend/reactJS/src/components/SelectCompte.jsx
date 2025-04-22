import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { axiosInstance } from "../utils/axios.jsx";

function SelectCompte({ setNetworks, setInfoComptes }) {
    const [listeComptes, setListeComptes] = useState([]);
    const [facebookPages, setFacebookPages] = useState({});
    const [fbSelectedPage, setFbSelectedPage] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalCompteId, setModalCompteId] = useState(null);

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
            setModalCompteId(null);
            return;
        }

        setInfoComptes?.(prev => ({ ...prev, [compteId]: pageId }));
        setSelectedIds(prev => (prev.includes(compteId) ? prev : [...prev, compteId]));
        setModalCompteId(null);
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
                    const isSelected = selectedIds.includes(compte.id);

                    return (
                        <div
                            key={compte.id}
                            className={`p-3 rounded-md cursor-pointer border transition-all duration-200 ${
                                isSelected ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "bg-white border-gray-300 hover:shadow"
                            }`}
                            onClick={() => {
                                if (isFacebook) {
                                    if (isSelected) {
                                        setFbSelectedPage(prev => {
                                            const copy = { ...prev };
                                            delete copy[compte.id];
                                            return copy;
                                        });
                                        setSelectedIds(prev => prev.filter(id => id !== compte.id));
                                        setInfoComptes?.(prev => {
                                            const copy = { ...prev };
                                            delete copy[compte.id];
                                            return copy;
                                        });
                                    } else {
                                        setModalCompteId(compte.id);
                                    }
                                } else {
                                    toggleSelect(compte.id);
                                }
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {getIcon(compte.provider)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal Facebook Pages */}
            {modalCompteId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Sélectionnez une page Facebook :</h2>
                        <select
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            value={fbSelectedPage[modalCompteId] ?? ""}
                            onChange={(e) => handlePageSelect(modalCompteId, e.target.value)}
                        >
                            <option value="">-- Choisir une page --</option>
                            {facebookPages[modalCompteId]?.map(pg => (
                                <option key={pg.id} value={pg.id}>{pg.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setModalCompteId(null)}
                            className="mt-4 w-full bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SelectCompte;
