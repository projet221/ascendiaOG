import { motion } from "framer-motion";

const AccueilInvite = () => {
    return (
        <div>
            aa
        <motion.div
            className="text-center p-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-3xl font-extrabold">Bienvenue sur notre plateforme</h1>
            <p className="mt-2 text-lg">Automatisez vos publications sur les réseaux sociaux en toute simplicité.</p>
            <div className="mt-4 space-x-4">
                <motion.button
                    className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    S&#39;inscrire
                </motion.button>
                <motion.button
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Se connecter
                </motion.button>
            </div>
        </motion.div>
        </div>
    );
};

export default AccueilInvite ;
