const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = {
  encodeAuthToken(user) {
    let authData = {
      username: user.username,
      email: user.email,
      _id: user._id,
      iat: Date.now()
    };
    return jwt.sign(authData, keys.jwtSecret);
  },

  decodeAuthToken(authToken) {
    try {
      return jwt.verify(authToken, keys.jwtSecret);
    } catch (err) {
      return false;
    }
  },

  populateUser(user, res, next) {
    mongoose
      .model('users')
      .findById(user._id)
      .populate({
        path: 'teams',
        populate: {
          path: 'league',
          model: 'leagues'
        }
      })
      .exec((err, userPopulated) => {
        res.user = userPopulated;
        next();
      });
  },

  populateTeam(team, res, next) {
    mongoose
      .model('teams')
      .findById(team._id)
      .populate({ path: 'league' })
      .exec((err, teamPopulated) => {
        res.team = teamPopulated;
        next();
      });
  }
};
