const express = require('express');
const router = express.Router();

const User = require('../../models/User');

router.get('/teams', User.getTeams, (req, res) => {
  res.send({ teams: res.teams });
});

module.exports = router;
