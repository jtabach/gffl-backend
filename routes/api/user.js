const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user');

router.get('/', UserController.getUser);
router.get('/teams', UserController.getTeams);

module.exports = router;
