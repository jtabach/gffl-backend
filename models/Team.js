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

const Team = mongoose.model('teams', teamSchema);

module.exports = Team;
