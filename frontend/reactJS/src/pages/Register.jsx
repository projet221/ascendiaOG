import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../utils/axios.jsx";
import InputField from "../components/InputField";
import "./../index.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Vérifier côté frontend (optionnel) que password === confirmPassword
    if (password !== confirmPassword) {
      setErrors(["Les mots de passe ne correspondent pas."]);
      return;
    }

    try {
      const response = await axiosInstance.post(
          "/api/users/register",
          { username, email, password },
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
      if (err.response) {
        const data = err.response.data;
        if (data.message) {
          setErrors([data.message]);
        } else if (data.errors) {
          const validationMessages = data.errors.map(e => e.msg);
          setErrors(validationMessages);
        } else {
          setErrors(["Une erreur est survenue lors de l'inscription."]);
        }
      } else {
        setErrors(["Impossible de contacter le serveur."]);
      }
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

        {/* Formulaire d'inscription */}
        <div className="flex items-center justify-center flex-grow px-4 py-12">
          <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
            <h2 className="text-2xl font-bold text-center mb-6">S'inscrire</h2>
            <form onSubmit={handleRegistration} className="space-y-4">
              <InputField
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                  type="email"
                  placeholder="Adresse e-mail"
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
                  className="w-full bg-[#FF0035] text-white py-3 rounded hover:bg-red-700 transition"
              >
                S'inscrire
              </button>
            </form>

            {/* Affichage des erreurs */}
            {errors.length > 0 && (
                <div className="text-red-500 text-sm mt-4">
                  {errors.map((errMsg, idx) => (
                      <p key={idx}>{errMsg}</p>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Register;
