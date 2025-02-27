import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Déclare le hook ici

    const handleLogin = async (e) => {
        e.preventDefault(); // Empêcher le rechargement de la page

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Identifiants incorrects !");
            }

            const data = await response.json();
            const token = data.token; // Récupérer le JWT
            const user_id = data.user._id;
            localStorage.setItem("token", token); // Stocker le token
            localStorage.setItem("user_id", user_id);
            alert("Connexion réussie !");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="card bg-light">
                <div className="card-title">
                    <h2 className="text-gradient"> Se Connecter </h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            className="form-control my-3"
                            placeholder="Identifiant ou mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="form-control my-3"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit"> Se connecter </button>
                    </form>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>
        </>
    );
}

export default Login;
