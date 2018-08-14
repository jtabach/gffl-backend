const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../helpers');

const League = require('./League');

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

teamSchema.statics.createTeam = teamData => {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  // check to see if the league exists
  // check to see if the user already has a team in the league
  // check to see if that team name has already been taken
   let newTeam = new Team();

   newTeam.name = req.body.name;
   newTeam.league = req.body.leagueId;
   newTeam.user = user._id;

   League.findById(newTeam.league)
   .then(err, foundLeague => {
     if (err) console.log(err);
     // return out of request with error
     return Team.findOne({ user: newTeam.user, league: newTeam.league })
   })
   .then(err, foundTeam => {
     if (err) console.log(err);
     // return out of request with error
     if (foundTeam) console.log('already have a team in this league')
     // return out of request with error
     return Team.findOne({ name: newTeam.name, league: newTeam.league});
   })
   .then(err, foundTeam => {
     if (err) console.log(err);
     // return out of request with error
     if (foundTeam) console.log('This team name has already been taken in this league')
     // return out of request with error
     return newTeam.save();
   })
   .then(() => {
     foundLeague.teams.push(newTeam._id);
     return foundLeague.save();
   })
   .then(() => User.findById(newTeam.user))
   .then(foundUser => {
     foundUser.teams.push(newTeam._id);
     return foundUser.save();
   })
   .then(() => next());
};

const Team = mongoose.model('teams', teamSchema);

module.exports = Team;
