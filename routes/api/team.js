const express = require('express');
const router = express.Router();

const League = require('../../models/League');

router.post('/', Team.createTeam, (req, res) => {
  res.send('team');
});

module.exports = router;