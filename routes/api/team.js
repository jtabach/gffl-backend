const express = require("express");
const router = express.Router();

const TeamController = require("../../controllers/team");

router.get("/:leagueId", TeamController.getTeam);
router.post("/", TeamController.createTeam);
router.post(
  "/fantasyEspnCookies/:teamId/:fantasyLeagueId",
  TeamController.setFantasyEspnCookies
);
router.delete(
  "/fantasyEspnCookies/:teamId",
  TeamController.deleteFantasyEspnCookies
);

module.exports = router;
