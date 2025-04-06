// routes/instagramRoutes.js

const express = require('express');
const router = express.Router();
const { getInstagramPosts } = require('../controllers/instagramController');

router.get('/posts', getInstagramPosts); // ⬅️ propre et clair

module.exports = router;
