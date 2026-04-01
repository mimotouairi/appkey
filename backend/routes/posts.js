const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);
router.get('/:id', auth, postController.getPost);
router.get('/feed', auth, postController.getFeed);
router.get('/explore', auth, postController.explore);

module.exports = router;
