import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import { useState } from "react";

const Index = () => {
    // État local pour gérer la connexion
    const [connexion, setConnexion] = useState(true);

    // Fonction pour inverser l'état de connexion
    const toggleConnexion = () => {
        setConnexion((prevConnexion) => !prevConnexion);
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
            </div>
        </div>
    );
};

export default Index;
