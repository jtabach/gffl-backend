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
    console.log(user);
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
  }
};
