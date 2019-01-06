const express = require('express');
const router = express.Router();

const FantasyController = require('../../controllers/fantasy');

router.get('/standings/:fantasyLeagueId', FantasyController.getStandings);
router.get('/scoreboard/:fantasyLeagueId/:matchupPeriodId', FantasyController.getScores);
router.get('/roster/:fantasyLeagueId/:fantasyTeamId', FantasyController.getRoster);

module.exports = router;
