const express = require('express');
const upload = require('../middlewares/upload'); 
const router = express.Router();
const postController = require('../controllers/postController');
const {getInstagramPosts,getInstagramPostById, getInstagramPostComments} = require("../controllers/instagramController");
const {getFacebookPosts} = require("../controllers/facebookController");

router.get("/alive", (req, res) => {res.status(200).send("OK");});
router.get('/:networks/:id', postController.getAllPosts);
router.post('/',upload.single('file'), postController.createPost);
router.post('/schedule',upload.single('file'), postController.schedulePost);
router.get("/scheduled",postController.getScheduledPostsByUser);
//aly
router.get('/instagram/post/:id', getInstagramPostById);
router.get('/instagram/post/:id/comments', getInstagramPostComments);
//fin aly
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/api/users/:userId/posts', postController.getUserPosts);
//router.put('/:id/schedule', postController.schedulePost);
router.put('/:id/analytics', postController.updateAnalytics);
router.get('/instagram/posts/:id', getInstagramPosts);
router.get("/facebook/posts/:id", getFacebookPosts);



module.exports = router; //c est har tt le monde a ce probleme mais personne sait comment résoudre
