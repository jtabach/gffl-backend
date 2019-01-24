const express = require('express');
const router = express.Router();

const LeagueController = require('../../controllers/league');

router.get('/:leagueId', LeagueController.getLeague);
router.post('/', LeagueController.createLeague);
router.post('/fantasyLeagueId/:leagueId', LeagueController.setFantasyLeagueId)
router.delete('/fantasyLeagueId/:leagueId', LeagueController.deleteFantasyLeagueId)

// TODO: use these routes for basic CRUD
// router.put('/fantasyLeagueId/:leagueId', LeagueController.changeFantasyLeagueId)

module.exports = router;
