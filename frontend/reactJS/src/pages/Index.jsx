import { Navigate } from "react-router-dom";
import HomePage from "./HomePage.jsx";

const Index = () => {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return <HomePage />;
};

export default Index;
