const express = require('express');
const router = express.Router();

const LeagueController = require('../../controllers/league');

router.post('/', LeagueController.createLeague);

module.exports = router;
