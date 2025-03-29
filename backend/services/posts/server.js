const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
// Load env vars
dotenv.config();
require('./jobs/cronScheduler');

const app = express();
const PORT = 3002;

// Middleware


// Connect to database
connectDB();

// Routes
app.use(cors());

app.use(postRoutes);
app.use(express.json());
// Error handling middleware
/*app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});*/

// Health check
app.get("/", (req, res) => {
    res.json({ status: "OK" });
});
app.listen(PORT, () => {
    console.log(`Posts service running on port ${PORT}`);
});