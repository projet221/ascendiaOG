const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const { join } = require("node:path");

dotenv.config();
require('./jobs/cronScheduler');
//require('./jobs/PromptRecommandations');
const app = express();
const PORT = process.env.PORT || 3002;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'controllers', 'uploads')));

app.use(postRoutes);

app.listen(PORT, () => {
  console.log(`✅ Posts service running on port ${PORT}`);
});
