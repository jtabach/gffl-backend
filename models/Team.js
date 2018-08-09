const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  }
});

// teamSchem.statics.createTeam = teamData => {
// teamData will consist of League ID and Team name
// leagueId will either come from res or teamData
// userId will come from
// };

const Team = mongoose.model('teams', teamSchema);

module.exports = Team;
