const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');

const TeamController = {
  createTeam
};

function createTeam(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  let newTeam = new Team();

  newTeam.name = req.body.teamName;
  newTeam.league = req.body.leagueId;
  newTeam.user = user._id;

  mongoose
    .model('League')
    .findById(newTeam.league, (err, foundLeague) => {
      // if (err) return res.status(400).send(err);

      return Team.findOne({ user: newTeam.user, league: newTeam.league });
    })
    .then(foundTeam => {
      // if (err) return res.status(400).send(err);

      // if (foundTeam) {
      //   res.status(400).send({
      //     verify: false,
      //     message: 'You already have a team in this league'
      //   });
      //   return next();
      // }
      // return out of request with error
      return mongoose
        .model('Team')
        .findOne({ name: newTeam.name, league: newTeam.league });
    })
    .then(foundTeam => {
      // if (err) return res.status(400).send(err);

      // if (foundTeam)
      // return res.status(400).send({
      //   verify: false,
      //   message: 'This team name has already been taken in this league'
      // });

      return newTeam.save();
    })
    .then(() => mongoose.model('League').findById(newTeam.league))
    .then(foundLeague => {
      foundLeague.teams.push(newTeam._id);
      return foundLeague.save();
    })
    .then(() => mongoose.model('User').findById(newTeam.user))
    .then(foundUser => {
      foundUser.teams.push(newTeam._id);
      return foundUser.save();
    })
    .then(() => helper.populateTeam(newTeam, res, next));
}

module.exports = TeamController;
