const mongoose = require('mongoose');
const _ = require('lodash');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');

const LeagueController = {
  getLeague,
  createLeague,
  setFantasyLeagueId
};

async function getLeague(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  let leagueId = req.params.leagueId;
  if (!user) {
    // send back some false object
  }

  const foundLeague = await League.findById(leagueId);
  const populatedLeague = await helper.populateLeague(foundLeague);

  const isPermitted = _.find(populatedLeague.teams, function(team) {
    return team.user._id == user._id;
  });

  if (!isPermitted) {
    res.status(400).send({ message: 'You are not in the league' })
  }
  return res.status(200).send({ league: populatedLeague });
}

async function createLeague(req, res, next) {
  const { authToken } = req.cookies;
  const { espnCookieS2, espnCookieSwid, fantasyLeagueId, leagueName } = req.body
  const user = helper.decodeAuthToken(authToken);

  const newLeague = new League();
  const newTeam = new Team();

  newLeague.name = leagueName;
  newLeague.fantasyLeagueId = fantasyLeagueId;
  newLeague.admin = user._id;
  newLeague.teams.push(newTeam.id);

  newTeam.espnCookieString = helper.structureEspnCookieString(espnCookieS2, espnCookieSwid);
  newTeam.user = user._id;
  newTeam.league = newLeague.id;

  try {
    await newLeague.save();
    await newTeam.save();

    const foundUser = await User.findById(user._id);
    foundUser.teams.push(newTeam.id);
    await foundUser.save();

    const populatedTeam = await helper.populateTeam(newTeam);
    return res.status(200).send({ team: populatedTeam })
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function setFantasyLeagueId(req, res, next) {
  const { fantasyLeagueId } = req.body;
  const { leagueId } = req.params;
  try {
    const foundLeague = await League.findById(leagueId);
    foundLeague.fantasyLeagueId = fantasyLeagueId;
    // TODO: check to see if fantasy id works with ESPN
    await foundLeague.save();
    return res.status(200).send({ fantasyLeagueId: fantasyLeagueId });
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = LeagueController;
