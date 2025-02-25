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

// Proxy configuration
app.use('/api/users', proxy('http://127.0.0.1:'+process.env.PORT_USERS));
//app.use('/api/posts', proxy('http://0.0.0.0:3002'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});