const express = require("express");
const axios = require("axios");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Fonction pour gérer les requêtes avec réveil des services Render
const handleProxyRequest = async (req, res, serviceUrl) => {
    try {
        console.log(`🔄 Redirection de la requête vers ${serviceUrl}${req.originalUrl}`);

        const response = await axios({
            method: req.method,
            url: `${serviceUrl}${req.originalUrl}`,
            data: req.body,
            headers: { ...req.headers, host: undefined }, // On enlève l'host pour éviter les conflits
            timeout: 10000,
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 502) {
            console.log(`⚠️ Service en veille détecté: ${serviceUrl}`);

            try {
                // Ping du service pour le réveiller
                console.log(`🔄 Tentative de réveil du service: ${serviceUrl}`);
                await axios.get(serviceUrl);

                // Attente 5 secondes pour le laisser s'activer
                await new Promise(resolve => setTimeout(resolve, 5000));

                console.log(`✅ Service réveillé, nouvelle tentative...`);

                // Réessaye la requête initiale
                const retryResponse = await axios({
                    method: req.method,
                    url: `${serviceUrl}${req.originalUrl}`,
                    data: req.body,
                    headers: { ...req.headers, host: undefined },
                    timeout: 10000,
                });

                return res.status(retryResponse.status).json(retryResponse.data);
            } catch (retryError) {
                console.error(`❌ Échec du réveil du service: ${retryError.message}`);
                return res.status(502).json({ error: "Le service est en veille et ne s'est pas réveillé." });
            }
        } else {
            console.error(`❌ Erreur lors de la requête: ${error.message}`);
            return res.status(500).json({ error: "Erreur interne du serveur." });
        }
    }
};

// Routes proxy
app.use("/api/posts", (req, res) => handleProxyRequest(req, res, process.env.PROXY_POSTS));
app.use("/api/users", (req, res) => handleProxyRequest(req, res, process.env.PROXY_USERS));
app.use("/api/socialauth", (req, res) => handleProxyRequest(req, res, process.env.PROXY_SOCIALAUTH));

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Gateway server running on port ${PORT}`);
});
