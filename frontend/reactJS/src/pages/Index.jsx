import {useState} from "react";
import BarreHaut from "../components/BarreHaut.jsx";
import ConfigSocialMedia from "../components/ConfigSocialMedia.jsx";
import Publier from "./Publier.jsx" ;
import HomePage from "./HomePage.jsx";

const Index = () => {
    // État local pour gérer la connexion
    const [connexion, setConnexion] = useState(true);

    // Fonction pour inverser l'état de connexion
    const toggleConnexion = () => {
        setConnexion((prevConnexion) => !prevConnexion);
    };
    const token = localStorage.getItem("token");

    return (
        <div>
            <head><link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>
</head>
            <HomePage/>
        
        {/*token ?
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="grid item-center bg-white p-8 rounded-lg shadow-md w-96">
                    < BarreHaut />
                    <ConfigSocialMedia />
                </div>
            </div>
            :
            
            <div>

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
        

                 <div className="grid item-center bg-white p-8 rounded-lg shadow-md ">
                      
                   {connexion ? <Login/> : <Register/>}
                    <button className="text-center mt-6" onClick={toggleConnexion}>
                        {connexion ? "S'inscrire" : "Se connecter"} 
                    </button>                                                            
            
                </div>
                
            </div>
            </div>*/}
            </div>
    );
};

export default Index;
