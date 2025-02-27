import React, { useState, useEffect } from 'react';
import PrivateRoute from "../components/PrivateRoute.jsx";

const Dashboard = () => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("Aucun token trouvé, l'utilisateur n'est peut-être pas connecté.");
                setUsername("Non connecté");
                return;
            }

            try {
                const response = await fetch("/api/users/"+localStorage.getItem("user_id"), {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                if (data.username) {
                    setUsername(data.username);
                } else {
                    console.warn("Données inattendues reçues :", data);
                    setUsername("Utilisateur inconnu");
                }

            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
                setUsername("Erreur de chargement");
            }
        };

        fetchUser();
    }, []); // useEffect exécuté une seule fois au montage du composant

    return (
        <>
            Bonjour {username}

        </>
    );
};

export default Dashboard;
