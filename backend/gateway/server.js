const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log('Requête reçue :', {
        method: req.method, // Méthode HTTP (GET, POST, etc.)
        url: req.originalUrl, // URL complète de la requête
        headers: req.headers, // En-têtes de la requête
        body: req.body, // Corps de la requête (pour les méthodes POST, PUT, etc.)
    });
    next(); // Passer à la suite
});

// Proxy configuration
app.use('/api/users', proxy(process.env.PROXY_USERS, {timeout: 10000}));
app.use('/api/socialauth', proxy(process.env.PROXY_SOCIALAUTH, {timeout: 10000}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({status: 'OK'});
});

// Démarrer le serveur HTTPS
app.listen(PORT);
