const express = require('express');
const router = express.Router();

const LikeController = require('../../controllers/like');

router.post('/', LikeController.likePost);
router.post('/delete', LikeController.deleteLikePost);

module.exports = router;
