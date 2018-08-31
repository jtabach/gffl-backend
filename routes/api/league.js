const express = require('express');
const router = express.Router();

const League = require('../../models/League');

router.post('/', League.createLeague, (req, res) => {
  res.send({ team: res.team });
});

module.exports = router;
