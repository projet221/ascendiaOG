const express = require('express');
const upload = require('../middlewares/upload'); 
const router = express.Router();
const postController = require('../controllers/postController');
const {
  getInstagramPosts,
  getInstagramPostById,
  getInstagramPostComments,
  getInstagramPostInsights,
  getInstagramStories
} = require("../controllers/instagramController");
const {getFacebookPosts, getFacebookPostById, getFacebookPostComments } = require("../controllers/facebookController");
const { traduireMessage, corrigerMessage, getSentiment } = require("../controllers/fonctionsIA");

router.get("/alive", (req, res) => {res.status(200).send("OK");});
router.get("/scheduled/:id",postController.getScheduledPostsByUser);
router.post('/delete',postController.deletePost);
router.get('/recommandation/:id', postController.getRecommandation);
router.get("/sentiment/:id", getSentiment );
router.get('/:networks/:id', postController.getAllPosts);
router.post('/',upload.single('file'), postController.createPost);
router.post('/schedule',upload.single('file'), postController.schedulePost);

//aly
router.get('/instagram/post/:id', getInstagramPostById);
router.get('/instagram/post/:id/comments', getInstagramPostComments);
router.get('/facebook/post/:id', getFacebookPostById);
router.get('/facebook/post/:id/comments', getFacebookPostComments);
//fin aly
router.get('/stat/engagement/facebook/:id',postController.getFacebookEngagement);
router.get('/instagram/posts/:id/insights', getInstagramPostInsights);
router.get('/instagram/stories', getInstagramStories); 


router.get('/:id', postController.getPostById);

router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/api/users/:userId/posts', postController.getUserPosts);
//router.put('/:id/schedule', postController.schedulePost);
router.put('/:id/analytics', postController.updateAnalytics);
router.get('/instagram/posts/:id', getInstagramPosts);
router.get("/facebook/posts/:id", getFacebookPosts);

router.post("/traduire", async (req, res) => {
  const { message, langue } = req.body;

  if (!message || !langue) {
    return res.status(400).json({ error: "Message ou langue manquant" });
  }

  try {
    const texteTraduit = await traduireMessage(message, langue);
    res.json({ message: texteTraduit });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la traduction" });
  }
});

router.post("/corriger", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  try {
    const texteCorrige = await corrigerMessage(message);
    res.json({ message: texteCorrige });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la correction" });
  }
});

module.exports = router; //c est har tt le monde a ce probleme mais personne sait comment résoudre
