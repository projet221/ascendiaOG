import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom"; // <== ajout
import { FaArrowLeft } from "react-icons/fa";

import InputField from "../components/InputField.jsx";
import { axiosInstance } from "../utils/axios.jsx";
import "./../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <== hook pour redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const token = data.token;
      const user_id = data.user._id;
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);

      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col text-white">
      {/* Fond animé combiné */}
      <div className="absolute inset-0 -z-10 bg-animated"></div>
      <div className="absolute inset-0 -z-10 flex justify-center items-center">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div className="bubbles">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="bubble"></span>
          ))}
        </div>
      </div>

      {/* Flèche retour */}
      <NavLink
  to="/"
  className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white text-2xl hover:bg-white hover:text-[#FF0035] transition"
  title="Retour à l'accueil"
>
  <FaArrowLeft />
</NavLink>

      {/* Formulaire de connexion */}
      <div className="flex items-center justify-center flex-grow px-4 py-12">
        <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
          <h2 className="text-2xl font-bold text-center mb-6">Se Connecter</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField
              type="text"
              placeholder="Email ou nom d'utilisateur"
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
              className="w-full bg-[#FF0035] text-white py-3 rounded hover:bg-red-700 transition"
            >
              Se connecter
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
