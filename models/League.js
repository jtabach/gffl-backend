const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../helpers');

leagueSchema = new Schema({
  name: { type: String, required: true },
  fantasyLeagueId: { type: String },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const League = mongoose.model('League', leagueSchema);

module.exports = League;
