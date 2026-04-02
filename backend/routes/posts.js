const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${path.basename(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/', auth, upload.single('media'), postController.createPost);
router.get('/:id', auth, postController.getPost);
router.get('/feed', auth, postController.getFeed);
router.get('/explore', auth, postController.explore);

module.exports = router;
