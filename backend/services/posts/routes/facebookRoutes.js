const express = require("express");
const router = express.Router();
const { getFacebookPosts } = require("../controllers/facebookController");

router.get("/posts", getFacebookPosts);

module.exports = router;
