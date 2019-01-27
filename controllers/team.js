const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const helper = require("../helpers");

const Team = require("../models/Team");
const User = require("../models/User");
const League = require("../models/League");

const TeamController = {
  getTeam,
  createTeam,
  setFantasyEspnCookies
};

function getTeam(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  let leagueId = req.params.leagueId;
  if (!user) {
    // send back some false object
  }
  mongoose
    .model("Team")
    .findOne({ league: leagueId, user: user._id })
    .exec((err, team) => {
      if (err) return next(err);
      return res.status(200).send({ team: team });
    });
}

async function createTeam(req, res, next) {
  let { authToken } = req.cookies;
  const { espnCookieS2, espnCookieSwid, leagueId } = req.body;

  let user = helper.decodeAuthToken(authToken);

  let newTeam = new Team();

  newTeam.espnCookieString = helper.structureEspnCookieString(
    espnCookieS2,
    espnCookieSwid
  );
  newTeam.league = leagueId;
  newTeam.user = user._id;

  const foundLeague = await mongoose.model("League").findById(newTeam.league);
  if (!foundLeague) {
    return res.status(400).send({ message: "League Id does not exist" });
  }

  const foundTeam = await Team.findOne({
    user: newTeam.user,
    league: newTeam.league
  });
  if (foundTeam) {
    return res
      .status(400)
      .send({ message: "You already have a team in this league" });
  }

  // TODO: switch to espn cookies
  // if (newTeam.fantasyTeamId) {
  //   const duplicateTeam = await mongoose.model('Team').findOne({ name: newTeam.fantasyTeamId, league: newTeam.league });
  //   if (duplicateTeam) {
  //     return res.status(400).send({ message: 'This team id has already been taken in this league' })
  //   }
  // }

  try {
    await newTeam.save();

    foundLeague.teams.push(newTeam._id);
    await foundLeague.save();

    const foundUser = await mongoose.model("User").findById(newTeam.user);
    foundUser.teams.push(newTeam._id);
    await foundUser.save();

    const populatedTeam = await helper.populateTeam(newTeam);
    res.status(400).send({ team: populatedTeam });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function setFantasyEspnCookies(req, res, next) {
  const { espnCookieS2, espnCookieSwid } = req.body;
  const { teamId, fantasyLeagueId } = req.params;

  const espnCookieString = await helper.structureEspnCookieString(
    espnCookieS2,
    espnCookieSwid
  );
  console.log("cookiesring", espnCookieString);

  const isFantasyCookieVerified = await _verifyFantasyCookie(
    fantasyLeagueId,
    espnCookieString
  );

  console.log("isVerifeid", isFantasyCookieVerified);

  if (!isFantasyCookieVerified) {
    return res.status(400).send({
      verify: false,
      message: "Not valid ESPN fantasy cookies"
    });
  }

  const foundTeam = await Team.findById(teamId);
  foundTeam.espnCookieString = espnCookieString;
  await foundTeam.save();
  return res.status(200).send({
    verify: true,
    message: "fantasy espn cookies set successfully",
    espnCookieString: foundTeam.espnCookieString
  });
}

async function _verifyFantasyCookie(fantasyLeagueId, espnCookieString) {
  const ESPN_BASE_URL = "http://games.espn.com/ffl/api/v2";

  const data = await helper
    .asyncRequest({
      url: `${ESPN_BASE_URL}/rosterInfo?leagueId=${fantasyLeagueId}&seasonId=2018`,
      method: "GET",
      headers: {
        Cookie: espnCookieString
      }
    })
    .then(response => JSON.parse(response));

  if (data.leagueRosters) {
    return true;
  }
  return false;
}

module.exports = TeamController;
