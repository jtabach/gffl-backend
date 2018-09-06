const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');

router.get('/', UserController.getUser);

// router.get('/teams', User.getTeams, (req, res) => {
//   res.send({ teams: res.teams });
// });

module.exports = router;
