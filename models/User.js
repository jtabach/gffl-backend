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
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'teams' }]
});

userSchema.statics.register = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // check if user or email already exists
  User.findOne({ email: email }, (err, foundUser) => {
    if (err) return res.status(400).send(err);
    if (foundUser)
      return res
        .status(400)
        .send({ verify: false, message: 'Email has already been taken.' });

    // create new user instance
    let user = new User();
    // hash plaintext password
    bcrypt.hash(password, 10, function(err, hash) {
      // Store hash in db
      user.email = email;
      user.password = hash;
      user.save((err, savedUser) => {
        if (err) return res.status(400).send(err);
        const authToken = helper.encodeAuthToken(savedUser);
        res.cookie('authToken', authToken);
        res.user = savedUser;
        next();
      });
    });
  });
};

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

  mongoose
    .model('teams')
    .find({ user: user._id })
    .populate('league')
    .exec((err, teams) => {
      res.teams = teams || [];
      next();
    });
};

const User = mongoose.model('users', userSchema);

module.exports = User;
