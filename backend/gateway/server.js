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
        method: req.method, 
        url: req.originalUrl, 
        headers: req.headers, 
        body: req.body, 
    });
    next(); 
});
// Proxy configuration with logging of response status code
app.use('/api/users', proxy(process.env.PROXY_USERS, {
    timeout: 10000,
    userResDecorator: (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers le backend: ${proxyRes.statusCode}`);
        return proxyResData; // Pass the response data forward
    }
}));

// Proxy configuration with logging of response status code
app.use('/api/socialauth', proxy(process.env.PROXY_SOCIALAUTH, {
    timeout: 10000,
    userResDecorator: (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers le backend: ${proxyRes.statusCode}`);
        return proxyResData; // Pass the response data forward
    }
}));


// Health check endpoint
app.use('/api/posts', proxy(process.env.PROXY_POSTS, {
    timeout: 10000,
    userResDecorator: (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers le backend: ${proxyRes.statusCode}`);
        return proxyResData; // Pass the response data forward
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Gateway server is running on port ${PORT}`);
});
