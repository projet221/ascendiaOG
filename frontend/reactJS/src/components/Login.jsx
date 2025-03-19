import {useState} from "react";
import InputField from "./InputField";
import {axiosInstance} from "../utils/axios.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(
                "/api/users/login",
                {email, password},
                {
                    headers: {
                        "Content-Type": "application/json",},
                }
            );

            const data=response.data;
            const token = data.token;
            const user_id = data.user._id;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            window.location.reload();
        } catch (err) {
            setError(err.message);
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
