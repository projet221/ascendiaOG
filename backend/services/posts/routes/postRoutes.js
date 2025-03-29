const express = require('express');
const upload = require('../middlewares/upload'); 
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.post('/',upload.single('file'), postController.createPost);
router.post('/schedule',upload.single('file'), postController.schedulePost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/api/users/:userId/posts', postController.getUserPosts);
//router.put('/:id/schedule', postController.schedulePost);
router.put('/:id/analytics', postController.updateAnalytics);
router.get('/tweets/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const tweets = await getAllTweets(userId);
    res.json(tweets); // Retourne les tweets sous forme de réponse JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tweets' });
  }
});


module.exports = router; //c est har tt le monde a ce probleme mais personne sait comment résoudre
