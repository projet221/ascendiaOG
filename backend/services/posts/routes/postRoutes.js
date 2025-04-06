const express = require('express');
const upload = require('../middlewares/upload'); 
const router = express.Router();
const postController = require('../controllers/postController');
const { getInstagramPosts } = require('../controllers/instagramController');

router.get('/posts', getInstagramPosts);

router.get('/:networks/:id', postController.getAllPosts);
router.post('/',upload.single('file'), postController.createPost);
router.post('/schedule',upload.single('file'), postController.schedulePost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/api/users/:userId/posts', postController.getUserPosts);
//router.put('/:id/schedule', postController.schedulePost);
router.put('/:id/analytics', postController.updateAnalytics);




module.exports = router; //c est har tt le monde a ce probleme mais personne sait comment résoudre
