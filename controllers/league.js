const mongoose = require('mongoose');
const _ = require('lodash');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');

const LeagueController = {
  getLeague,
  createLeague
};

function getLeague(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  let leagueId = req.params.leagueId;
  if (!user) {
    // send back some false object
  }
  mongoose
    .model('League')
    .findById(leagueId)
    .populate([
      {
        path: 'teams',
        populate: {
          path: 'user',
          model: 'User'
        }
      },
      {
        path: 'posts',
        populate: {
          path: 'team',
          model: 'Team'
        }
      }
    ])
    .exec((err, league) => {
      if (err) return next(err);
      const isPermitted = _.find(league.teams, function(team) {
        return team.user._id == user._id;
      });
      if (!isPermitted) {
        // send back some false object
      }
      return res.status(200).send({ league: league });
    });
}

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
