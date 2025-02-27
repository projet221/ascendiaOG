import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setIsRedirecting(true);
        }
    }, [token]); // Vérifie le token à chaque changement

    if (isRedirecting) {
        return <Navigate to="/" replace />;
    }

    return token ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
