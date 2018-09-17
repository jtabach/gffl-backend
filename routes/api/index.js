const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/league', require('./league'));
router.use('/team', require('./team'));
router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/like', require('./like'));

module.exports = router;
