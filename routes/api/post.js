const express = require('express');
const router = express.Router();

const PostController = require('../../controllers/post');

router.post('/', PostController.createPost);
router.post('/delete', PostController.deletePost);

module.exports = router;
