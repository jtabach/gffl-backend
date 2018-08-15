const express = require('express');
const router = express.Router();

const User = require('../../models/User');

router.get('/leagues', User.getLeagues, (req, res) => {
  res.send({ teams: res.teams });
  // res.send('team');
});

module.exports = router;
