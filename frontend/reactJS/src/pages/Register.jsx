import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../utils/axios.jsx";
import InputField from "../components/InputField";
import "./../index.css";

function Register() {
  // États locaux pour gérer les champs du formulaire
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Fonction de validation d'une adresse e-mail avec regex
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction de validation d’un mot de passe sécurisé
  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(pwd);
  };

  // Gestionnaire de soumission du formulaire
  const handleRegistration = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    // Vérifie que les mots de passe correspondent
    if (password !== confirmPassword) {
      validationErrors.push("Les mots de passe ne correspondent pas.");
    }

    // Vérifie la force du mot de passe
    if (!isStrongPassword(password)) {
      validationErrors.push(
          "Le mot de passe doit contenir au moins 6 caractères, dont au moins une lettre et un chiffre."
      );
    }

    // Vérifie le format de l'e-mail
    if (!isValidEmail(email)) {
      validationErrors.push("L'adresse e-mail n'est pas valide.");
    }

    // Vérifie que le nom d'utilisateur n'est pas vide
    if (!username.trim()) {
      validationErrors.push("Le nom d'utilisateur est requis.");
    }

    // Si des erreurs de validation existent, les afficher
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Si tout est valide, envoyer la requête d'inscription au backend
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

      // Sauvegarde du token et de l'ID utilisateur dans le localStorage
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user._id);

      // Redirection vers le dashboard après inscription réussie
      navigate("/dashboard");
    } catch (err) {
      // Gestion des erreurs retournées par le backend
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
        {/* Arrière-plan animé */}
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

        {/* Bouton retour vers l'accueil */}
        <NavLink
            to="/"
            className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white text-2xl hover:bg-white hover:text-[#FF0035] transition"
            title="Retour à l'accueil"
        >
          <FaArrowLeft />
        </NavLink>

        {/* Conteneur du formulaire d'inscription */}
        <div className="flex items-center justify-center flex-grow px-4 py-12">
          <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
            <h2 className="text-2xl font-bold text-center mb-6">S&#39;inscrire</h2>

            {/* Formulaire d'inscription */}
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
                S&#39;inscrire
              </button>
            </form>

            {/* Affichage des erreurs de validation ou du backend */}
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
