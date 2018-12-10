const express = require('express');
const router = express.Router();

const NewsController = require('../../controllers/news');

router.get('/players', NewsController.getPlayerNews);

module.exports = router;
