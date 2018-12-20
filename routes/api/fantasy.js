const express = require('express');
const router = express.Router();

const FantasyController = require('../../controllers/fantasy');

router.get('/standings/:fantasyLeagueId', FantasyController.getStandings);
router.get('/scoreboard/:fantasyLeagueId/:matchupPeriodId', FantasyController.getScores);

module.exports = router;
