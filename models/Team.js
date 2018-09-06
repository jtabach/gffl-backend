const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../helpers');

const League = require('./League');
const User = require('./User');

teamSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  name: { type: String, required: true }
});

teamSchema.statics.createTeam = (req, res, next) => {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  // check to see if the league exists
  // check to see if the user already has a team in the league
  // check to see if that team name has already been taken
  let newTeam = new Team();

  newTeam.name = req.body.teamName;
  newTeam.league = req.body.leagueId;
  newTeam.user = user._id;
  console.log(newTeam);

  mongoose
    .model('League')
    .findById(newTeam.league, (err, foundLeague) => {
      // if (err) return res.status(400).send(err);

      return Team.findOne({ user: newTeam.user, league: newTeam.league });
    })
    .then(foundTeam => {
      // if (err) return res.status(400).send(err);

      // if (foundTeam)
      //   return res.status(400).send({
      //     message: 'You already have a team in this league'
      //   });
      // return out of request with error
      return Team.findOne({ name: newTeam.name, league: newTeam.league });
    })
    .then(foundTeam => {
      // if (err) res.status(400).send(err);

      // if (foundTeam)
      //   return res.status(400).send({
      //     message: 'This team name has already been taken in this league'
      //   });

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
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
