const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');

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
    .model('Team')
    .findOne({ league: leagueId, user: user._id })
    .exec((err, team) => {
      if (err) return next(err);
      return res.status(200).send({ team: team });
    });
}

async function createTeam(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  let newTeam = new Team();

  newTeam.fantasyTeamId = req.body.fantasyTeamId;
  newTeam.league = req.body.leagueId;
  newTeam.user = user._id;

  var foundLeague;

  try {
    foundLeague = await mongoose.model('League').findById(newTeam.league);
  } catch {
    return res.status(400).send({ message: 'LeagueId does not exist' });
  }

  const errorTeam = await Team.findOne({ user: newTeam.user, league: newTeam.league });
  if (errorTeam) {
    return res.status(400).send({ message: 'You already have a team in this league' })
  }

  if (newTeam.fantasyTeamId) {
    const duplicateTeam = await mongoose.model('Team').findOne({ name: newTeam.fantasyTeamId, league: newTeam.league });
    if (duplicateTeam) {
      return res.status(400).send({ message: 'This team id has already been taken in this league' })
    }
  }

  try {
    await newTeam.save();

    foundLeague.teams.push(newTeam._id);
    await foundLeague.save();

    const foundUser = await mongoose.model('User').findById(newTeam.user);
    foundUser.teams.push(newTeam._id);
    await foundUser.save();

    const populatedTeam = await helper.populateTeam(newTeam);
    res.status(400).send({ team: populatedTeam })
  } catch (err) {
    return res.status(400).send(err)
  }
}

async function setFantasyEspnCookies(req, res, next) {
  const { espnCookieS2, espnCookieSwid } = req.body;
  const { teamId } = req.params;

  const espnCookieString = helper.structureEspnCookieString(espnCookieS2, espnCookieSwid);

  try {
    const foundTeam = await Team.findById(teamId);
    foundTeam.espnCookieString = espnCookieString;
    // TODO: check to see if fantasy team id works with ESPN
    await foundTeam.save();
    return res.status(200).send({ espnCookieString: foundTeam.espnCookieString });
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = TeamController;
