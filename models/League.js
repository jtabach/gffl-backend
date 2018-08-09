const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../helpers');

const Team = require('./Team');
const User = require('./User');

leagueSchema = new Schema({
  name: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

leagueSchema.statics.createLeague = (req, res, next) => {
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
    .then(() => User.findById(user._id))
    .then(foundUser => {
      foundUser.teams.push(newTeam.id);
      return foundUser.save();
    })
    .then(() => next());
};

const League = mongoose.model('leagues', leagueSchema);

module.exports = League;
