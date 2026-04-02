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

router.use(auth);

// IMPORTANT: Define specific routes BEFORE generic ones like /:id
router.get('/feed', postController.getFeed);
router.get('/explore', postController.explore);
router.post('/', upload.single('media'), postController.createPost);
router.get('/:id', postController.getPost);

module.exports = router;
