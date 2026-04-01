const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const auth = require('../middleware/auth');

router.post('/:id/like', auth, interactionController.likePost);
router.delete('/:id/like', auth, interactionController.unlikePost);
router.post('/:id/comment', auth, interactionController.commentPost);
router.get('/:id/comments', auth, interactionController.getComments);
router.post('/:id/share', auth, interactionController.sharePost);

module.exports = router;
