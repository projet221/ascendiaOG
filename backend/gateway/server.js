const https = require('https');
const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

const options = {
    key: fs.readFileSync('server.key'),  // Clé privée
    cert: fs.readFileSync('server.crt')  // Certificat SSL
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Proxy configuration
app.use('/api/users', proxy(process.env.PROXY_USERS, {timeout: 10000}));
app.use('/api/socialauth', proxy(process.env.PROXY_SOCIALAUTH, {timeout: 10000}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({status: 'OK'});
});

// Démarrer le serveur HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`API Gateway running securely on https://localhost:${PORT}`);
});
