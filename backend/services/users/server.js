const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT_USERS || 3001;

const options = {
    key: fs.readFileSync('server.key'),  // Clé privée
    cert: fs.readFileSync('server.crt')  // Certificat SSL
};


// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use(userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Something went wrong!'});
});


https.createServer(options, app).listen(PORT, () => {
    console.log(`API users running securely on https://localhost:${PORT}`);
});