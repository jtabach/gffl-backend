const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');

const LeagueController = {
  createLeague
};

function createLeague(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  let newLeague = new League();
  let newTeam = new Team();

  newLeague.name = req.body.leagueName;
  newLeague.admin = user._id;
  newLeague.teams.push(newTeam.id);

  newTeam.name = req.body.teamName;
  newTeam.user = user._id;
  newTeam.league = newLeague.id;

  return newLeague
    .save()
    .then(() => newTeam.save())
    .then(() => mongoose.model('User').findById(user._id))
    .then(foundUser => {
      foundUser.teams.push(newTeam.id);
      return foundUser.save();
    })
    .then(() => helper.populateTeam(newTeam, res, next));
}

module.exports = LeagueController;
