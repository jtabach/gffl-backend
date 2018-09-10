const express = require('express');
const router = express.Router();

const TeamController = require('../../controllers/team');

router.get('/:leagueId', TeamController.getTeam);
router.post('/', TeamController.createTeam);

module.exports = router;
