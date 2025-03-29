import { useNavigate } from "react-router-dom"; // Ajout de l'import
import HomePage from "./HomePage.jsx";

const Index = () => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate(); // Correction ici

    if (token) {
        navigate("/dashboard");
    }

    return (
        <div>
            <HomePage />
        </div>
    );
};

export default Index;
