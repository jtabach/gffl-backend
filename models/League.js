const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  // get authToken from req.cookies
  // decode cookie to get the user._id
  // save new league to DB
  // in next():
  // save new team to DB --> Team.createTeam
  // save new team to League model array of teams --> League.addTeamToLeague
  // save new league to User model array of leagues
  // save new team to User model array of teams
};

leagueSchema.statics.addTeamToLeague = (req, res, next) => {
  // takes leagueId and UserId from res
  // fetch league by league Id and push team to teams array
};

const League = mongoose.model('leagues', leagueSchema);

module.exports = League;
