import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import { useState } from "react";

const Index = () => {
    // État local pour gérer la connexion
    const [connexion, setConnexion] = useState(true);
    const [test, setTest] = useState("");

    // Fonction pour inverser l'état de connexion
    const toggleConnexion = () => {
        setConnexion((prevConnexion) => !prevConnexion);
    };
    const testM = async () => {
        try {
            const response = await fetch("/api/users/",{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }); // Assurez-vous que cette route est correcte
            const data = await response.json();
            console.log(data[0]);
            setTest(data[0].username); // Assurez-vous que la réponse contient un champ "message"
            localStorage.removeItem("token"); // Supprime le token
        } catch (error) {
            console.error("Erreur lors de la récupération du message :", error);
            setTest("Erreur lors du chargement du message");
        }
    };

    return (
        <div>
            <div className="App">
                <button
                    className="btn btn-primary position-absolute top-0 start-0 m-3"
                    onClick={toggleConnexion}
                >
                    {connexion ? 'Passer à Register' : 'Passer à Login'}
                </button>
                {connexion ? <Login /> : <Register />}
                <button onClick={testM}>{test}</button>
            </div>
        </div>
    );
};

export default Index;
