const express = require('express');
const router = express.Router();

const Team = require('../../models/Team');

router.post('/', Team.createTeam, (req, res) => {
  res.send('team');
});

module.exports = router;