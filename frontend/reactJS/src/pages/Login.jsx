import { useState } from "react"; // Importation de hook useState pour gérer les états
import { useNavigate, NavLink } from "react-router-dom"; // Importation des hooks pour la navigation
import { FaArrowLeft } from "react-icons/fa"; // Importation de l'icône flèche de retour de react-icons

import InputField from "../components/InputField.jsx"; // Composant pour les champs de saisie
import { axiosInstance } from "../utils/axios.jsx"; // Instance axios pour les appels API
import "./../index.css"; // Importation de la feuille de style principale

function Login() {
  // Déclaration des états nécessaires pour gérer les valeurs des champs de saisie et les erreurs
  const [email, setEmail] = useState(""); // État pour l'email
  const [password, setPassword] = useState(""); // État pour le mot de passe
  const [errors, setErrors] = useState([]); // État pour stocker un tableau d’erreurs
  const navigate = useNavigate(); // Hook pour rediriger l'utilisateur après la connexion

  // Fonction appelée lors de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)
    setErrors([]); // Réinitialiser les erreurs avant l'appel à l'API

    try {
      // Envoi de la requête POST avec l'email et le mot de passe
      const response = await axiosInstance.post(
          "/api/users/login", // URL de l'API pour la connexion
          { email, password }, // Corps de la requête avec les données de connexion
          {
            headers: {
              "Content-Type": "application/json", // Définition du type de contenu
            },
          }
      );

      // Récupération des données de la réponse
      const data = response.data;
      const token = data.token; // Récupération du token
      const user_id = data.user._id; // Récupération de l'ID utilisateur

      // Sauvegarde du token et de l'ID utilisateur dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);

      // Redirection vers le tableau de bord après une connexion réussie
      navigate("/dashboard");
    } catch (err) {
      // Gestion des erreurs si l'appel à l'API échoue
      if (err.response) {
        // Si une erreur HTTP est renvoyée par le serveur
        const data = err.response.data; // Données de l'erreur retournées par le serveur

        // Si le serveur retourne un message d'erreur spécifique
        if (data.message) {
          setErrors([data.message]); // On place le message d'erreur dans le tableau des erreurs
        }
        // Si le serveur retourne des erreurs de validation sous forme de tableau
        else if (data.errors) {
          // Récupérer les messages d'erreur et les ajouter à l'état des erreurs
          const validationMessages = data.errors.map(e => e.msg);
          setErrors(validationMessages);
        } else {
          // Message d'erreur générique si aucune information détaillée n'est fournie
          setErrors(["Une erreur est survenue."]);
        }
      } else {
        // Si aucune réponse du serveur (erreur réseau, serveur non disponible)
        setErrors(["Impossible de contacter le serveur."]);
      }
    }
  };

  return (
      <div className="relative min-h-screen overflow-hidden flex flex-col text-white">
        {/* Fond animé combiné */}
        <div className="absolute inset-0 -z-10 bg-animated"></div>
        <div className="absolute inset-0 -z-10 flex justify-center items-center">
          {/* Blobs et bulles animées en arrière-plan */}
          <div className="blob1"></div>
          <div className="blob2"></div>
          <div className="bubbles">
            {[...Array(20)].map((_, i) => (
                <span key={i} className="bubble"></span>
            ))}
          </div>
        </div>

        {/* Flèche retour à la page d'accueil */}
        <NavLink
            to="/" // Redirection vers la page d'accueil
            className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white text-2xl hover:bg-white hover:text-[#FF0035] transition"
            title="Retour à l'accueil"
        >
          <FaArrowLeft /> {/* Icône de flèche de retour */}
        </NavLink>

        {/* Formulaire de connexion */}
        <div className="flex items-center justify-center flex-grow px-4 py-12">
          <div className="bg-white text-black p-8 rounded-lg shadow-md w-full max-w-md z-10">
            {/* Titre du formulaire */}
            <h2 className="text-2xl font-bold text-center mb-6">Se Connecter</h2>

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                  type="text"
                  placeholder="Email ou nom d'utilisateur"
                  value={email} // Valeur de l'input liée à l'état email
                  onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état email
              />
              <InputField
                  type="password"
                  placeholder="Mot de passe"
                  value={password} // Valeur de l'input liée à l'état password
                  onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état password
              />
              {/* Bouton de soumission */}
              <button
                  type="submit"
                  className="w-full bg-[#FF0035] text-white py-3 rounded hover:bg-red-700 transition"
              >
                Se connecter
              </button>
            </form>

            {/* Affichage des erreurs */}
            {errors.length > 0 && (
                <div className="text-red-500 text-sm mt-4">
                  {errors.map((errMsg, idx) => (
                      <p key={idx}>{errMsg}</p> // Affichage de chaque message d'erreur
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Login;
