const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const _ = require('lodash');
const helper = require('../helpers');

const League = require('./League');
const Team = require('./Team');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

userSchema.statics.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ user: false, message: 'Missing e-mail or password' });
  }
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(400).send(err);
    if (!foundUser) {
      return res
        .status(400)
        .send({ user: false, message: 'Email address not found' });
    }
    bcrypt.compare(req.body.password, foundUser.password, (err, correct) => {
      if (err) return res.status(400).send(err);
      if (!correct) {
        return res
          .status(403)
          .send({ user: false, message: 'Incorrect password' });
      }
      const authToken = helper.encodeAuthToken(foundUser);

      res.cookie('authToken', authToken);
      // TODO: Don't send the user hashed password to the client
      helper.populateUser(foundUser, res, next);
    });
  });
};

userSchema.statics.logout = (req, res, next) => {
  res.clearCookie('authToken');
  res.user = false;
  next();
};

userSchema.statics.getUser = (req, res, next) => {
  const { authToken } = req.cookies;
  const user = helper.decodeAuthToken(authToken);
  if (!user) {
    res.user = user;
    next();
  } else {
    helper.populateUser(user, res, next);
  }
};

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
