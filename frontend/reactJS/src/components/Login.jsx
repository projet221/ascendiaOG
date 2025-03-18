import { useState } from "react";
import InputField from "./InputField";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const requestBody = JSON.stringify({ email, password });
            console.log("Requête envoyée :", requestBody); // Affiche la requête dans la console

            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            });

            console.log("Réponse reçue :", response); // Affiche la réponse brute dans la console

            if (!response.ok) {
                throw new Error("Identifiants incorrects !");
            }

            const data = await response.json();
            console.log("Données de la réponse :", data); // Affiche les données de la réponse dans la console

            const token = data.token;
            const user_id = data.user._id;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            window.location.reload();
        } catch (err) {
            setError(err.message);
            console.error("Erreur lors de la connexion :", err); // Affiche l'erreur dans la console
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Se Connecter</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <InputField
                    type="text"
                    placeholder="Username ou mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-gray-400 text-white py-3 rounded hover:bg-green-600 transition"
                >
                    Se connecter
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
}

export default Login;
