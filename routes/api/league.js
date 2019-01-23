const express = require('express');
const router = express.Router();

const LeagueController = require('../../controllers/league');

router.get('/:leagueId', LeagueController.getLeague);
router.post('/', LeagueController.createLeague);
router.post('/setFantasyLeagueId/:leagueId', LeagueController.setFantasyLeagueId)
router.post('/deleteFantasyLeagueId', LeagueController.deleteFantasyLeagueId)

module.exports = router;
