const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../helpers');

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
  espnCookieString: {
    type: String
  }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
