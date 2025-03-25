import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import {useState} from "react";
import BarreHaut from "../components/BarreHaut.jsx";
import ConfigSocialMedia from "../components/ConfigSocialMedia.jsx";

const Index = () => {
    // État local pour gérer la connexion
    const [connexion, setConnexion] = useState(true);

    // Fonction pour inverser l'état de connexion
    const toggleConnexion = () => {
        setConnexion((prevConnexion) => !prevConnexion);
    };
    const token = localStorage.getItem("token");

    return (
        token ?
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="grid item-center bg-white p-8 rounded-lg shadow-md w-96">
                    < BarreHaut />
                    <ConfigSocialMedia />
                </div>
            </div>
            :
            
            
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="grid item-center bg-white p-8 rounded-lg shadow-md ">
                {/*<Publier/>*/}
                      
                   {connexion ? <Login/> : <Register/>}
                    <button className="text-center mt-6" onClick={toggleConnexion}>
                        {connexion ? "S'inscrire" : "Se connecter"} 
                    </button>                                                            
            
                </div>
            </div>
    );
};

export default Index;
