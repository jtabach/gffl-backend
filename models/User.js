const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helpers');

const Team = require('./Team');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

// TODO: remove due to redundancy, of getUser
userSchema.statics.getTeams = (req, res, next) => {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  Team.find({ user: user._id })
    .populate('league')
    .exec((err, teams) => {
      res.teams = teams || [];
      next();
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
