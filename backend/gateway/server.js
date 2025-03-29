const express = require("express");
const proxy = require("express-http-proxy");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Fonction pour gérer les erreurs 502 et réveiller le microservice
const proxyWithWakeUp = (serviceUrl) => {
    return proxy(serviceUrl, {
        timeout: 10000,

        proxyErrorHandler: async (err, res, next) => {
            if (err.code === "ECONNREFUSED" || res.statusCode === 502) {
                console.log(`[⚠️] Service en veille détecté: ${serviceUrl}`);

                try {
                    console.log(`[🔄] Tentative de réveil du service: ${serviceUrl}`);
                    await axios.get(serviceUrl); // Ping pour réveiller le service
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Attente 5s

                    console.log(`[✅] Service réveillé, nouvelle tentative...`);
                    return next(); // Réessaye la requête originale
                } catch (error) {
                    console.error(`[❌] Échec du réveil: ${error.message}`);
                }
            }
            next(err); // Passe l'erreur au middleware suivant si autre problème
        }
    });
};

// Configuration des routes proxy avec gestion du réveil
app.use("/api/posts", proxyWithWakeUp(process.env.PROXY_POSTS));
app.use("/api/users", proxyWithWakeUp(process.env.PROXY_USERS));
app.use("/api/socialauth", proxyWithWakeUp(process.env.PROXY_SOCIALAUTH));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Gateway server running on port ${PORT}`);
});
