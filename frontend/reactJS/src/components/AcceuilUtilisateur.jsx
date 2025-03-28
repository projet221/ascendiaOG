import { motion } from "framer-motion";

const AccueilUtilisateur = () => {
    return (
        <motion.div
            className="text-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-extrabold">Bienvenue sur votre espace</h1>
            <p className="mt-2 text-lg">Gérez vos publications et automatisez votre contenu facilement.</p>
            <motion.button
                className="mt-4 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                Accéder au tableau de bord
            </motion.button>
        </motion.div>
    );
};


export default AccueilUtilisateur;
