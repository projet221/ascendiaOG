const express = require("express");
const proxy = require("express-http-proxy");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Fonction pour gérer les erreurs 502 et réveiller le microservice
const handleProxyWithWakeUp = (serviceUrl) => {
    return proxy(serviceUrl, {
        timeout: 10000,

        proxyReqOptDecorator: async (proxyReqOpts, srcReq) => {
            try {
                console.log(`🔄 Tentative d'appel à ${serviceUrl}${srcReq.originalUrl}`);
                return proxyReqOpts;
            } catch (error) {
                console.error(`❌ Erreur lors de la préparation de la requête: ${error.message}`);
                throw error;
            }
        },

        proxyErrorHandler: async (err, res, next) => {
            console.log(`⚠️ Erreur détectée (${err.code || "Unknown"}), possible service en veille : ${serviceUrl}`);

            if (err.code === "ECONNREFUSED") {
                try {
                    console.log(`🔄 Ping du service pour le réveiller: ${serviceUrl}`);
                    await axios.get(serviceUrl);

                    console.log(`✅ Service réveillé, nouvelle tentative dans 5 secondes...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    return next();
                } catch (wakeUpError) {
                    console.error(`❌ Échec du réveil du service: ${wakeUpError.message}`);
                    return res.status(502).json({ error: "Service en veille et non réveillé." });
                }
            }

            return next(err);
        },

        userResDecorator: (proxyRes, proxyResData) => {
            console.log(`✅ Réponse reçue du backend (${proxyRes.statusCode}): ${serviceUrl}`);
            return proxyResData;
        }
    });
};

// Routes proxy avec réveil automatique
app.use("/api/posts", handleProxyWithWakeUp(process.env.PROXY_POSTS));
app.use("/api/users", handleProxyWithWakeUp(process.env.PROXY_USERS));
app.use("/api/socialauth", handleProxyWithWakeUp(process.env.PROXY_SOCIALAUTH));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Gateway server running on port ${PORT}`);
});
