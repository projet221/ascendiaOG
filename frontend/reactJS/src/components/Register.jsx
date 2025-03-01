import InputField from "./InputField";
import {useState} from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, email, password}),
            });
            if (!response.ok) {
                throw new Error("Identifiants incorrects !");
            }

            const data = await response.json();
            const token = data.token;
            const user_id = data.user._id;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">S'inscrire</h2>
            <form onSubmit={handleRegistration} className="space-y-4">
                <InputField
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                    type="mail"
                    placeholder="Mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-gray-400 text-white py-3 rounded hover:bg-green-600 transition"
                >
                    S'inscrire
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
}

export default Register;
