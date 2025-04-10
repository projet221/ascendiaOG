const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();
const PORT = process.env.PORT_GATEWAY || 3000;

// Middleware
app.use(helmet());
app.use(cors());

async function wakeUpService(url) {
    let awake = false;
    let attempt = 0;

    console.log(`Service endormi détecté. Tentative de réveil sur ${url}...`);

    while (!awake && attempt < 10) { // max 10 tentatives
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                awake = true;
                console.log(`Service réveillé après ${attempt} tentative(s)`);
            }
        } catch (err) {
            console.log(`Tentative ${attempt + 1} échouée: ${err.message}`);
        }

        attempt++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // pause de 2 secondes
    }

    if (!awake) {
        console.warn(`Impossible de réveiller le service après ${attempt} tentatives.`);
    }
}

// Proxy - Posts
app.use('/api/posts', proxy(process.env.PROXY_POSTS, {
    timeout: 10000,
    userResDecorator: async (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers /posts: ${proxyRes.statusCode}`);
        if (proxyRes.statusCode >= 400 && proxyRes.statusCode < 600) {
            await wakeUpService(process.env.PROXY_POSTS + '/ping');
        }
        return proxyResData;
    }
}));

// Proxy - Users
app.use('/api/users', proxy(process.env.PROXY_USERS, {
    timeout: 10000,
    userResDecorator: async (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers /users: ${proxyRes.statusCode}`);
        if (proxyRes.statusCode >= 400 && proxyRes.statusCode < 600) {
            await wakeUpService(process.env.PROXY_USERS + '/ping');
        }
        return proxyResData;
    }
}));

// Proxy - SocialAuth
app.use('/api/socialauth', proxy(process.env.PROXY_SOCIALAUTH, {
    timeout: 10000,
    userResDecorator: async (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers /socialauth: ${proxyRes.statusCode}`);
        if (proxyRes.statusCode >= 400 && proxyRes.statusCode < 600) {
            await wakeUpService(process.env.PROXY_SOCIALAUTH + '/ping');
        }
        return proxyResData;
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});
/*
app.use('/api/instagram', proxy(process.env.PROXY_POSTS, {
    timeout: 10000,
    userResDecorator: (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers Instagram/posts: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}));

app.use('/api/facebook', proxy(process.env.PROXY_POSTS, {
    timeout: 10000,
    userResDecorator: (proxyRes, proxyResData) => {
        console.log(`Réponse du proxy vers facebook/posts: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}));
*/
// Start the server
app.listen(PORT, () => {
    console.log(`Gateway server is running on port ${PORT}`);
});
