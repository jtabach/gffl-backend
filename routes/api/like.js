const express = require('express');
const router = express.Router();

const LikeController = require('../../controllers/like');

router.post('/', LikeController.likePost);

module.exports = router;
