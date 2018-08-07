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

const League = mongoose.model('leagues', leagueSchema);

module.exports = League;
