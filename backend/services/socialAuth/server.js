const https = require('https');
const fs = require('fs');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const socialAuthRoutes = require("./routes/socialAuthRoutes");
dotenv.config();
connectDB();

const app = express();

const options = {
    key: fs.readFileSync('server.key'),  // Clé privée
    cert: fs.readFileSync('server.crt')  // Certificat SSL
};

app.use(cors());
app.use(express.json());
app.use(session({secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport"); // Charge la configuration de Passport

// Routes
app.use(socialAuthRoutes);

const PORT = process.env.PORT || 3002;

https.createServer(options, app).listen(PORT, () => {
    console.log(`API socialAuth running securely on https://localhost:${PORT}`);
});

