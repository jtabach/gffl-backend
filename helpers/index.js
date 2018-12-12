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
      .model('User')
      .findById(user._id)
      .populate([
        {
          path: 'teams',
          populate: {
            path: 'league',
            model: 'League'
          }
        },
        {
          path: 'notifications',
          model: 'Notification',
          populate: [
            {
              path: 'actor',
              model: 'User'
            },
            {
              path: 'league',
              model: 'League'
            }
          ]
        }
      ])
      .exec((err, userPopulated) => {
        if (err) return next(err);
        return res.status(200).send({ user: userPopulated });
      });
  },

  async populateTeam(team) {
    return mongoose.model('Team').findById(team._id)
      .populate({ path: 'league' });
  }
};
