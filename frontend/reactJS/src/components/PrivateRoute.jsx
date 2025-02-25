import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const token = localStorage.getItem("token");
    console.log("jenpasse ici ")
    useEffect(() => {
        console.log("Vérification du token:", token); // Debugging pour vérifier le token
        if (token) {
            setIsRedirecting(true);
        }
    }, [token]); // Vérifie le token à chaque changement
    if (token) {
        setIsRedirecting(true);
    }
    if (!token) {
        setIsRedirecting(false);
    }
    if (isRedirecting) {
        return <Navigate to="/" replace />;
    }

    return token ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
