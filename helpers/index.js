const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const mongoose = require('mongoose');

const User = require('../models/User');
const League = require('../models/League');


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

  async populateUser(user) {
    return mongoose.model('User').findById(user._id)
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
      ]);
  },

  async populateLeague(league) {
    return League.findById(league._id)
    .populate([
      {
        path: 'teams',
        populate: {
          path: 'user',
          model: 'User'
        }
      },
      {
        path: 'posts',
        populate: [
          {
            path: 'team',
            model: 'Team'
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'team',
              model: 'Team'
            }
          },
          {
            path: 'likes',
            model: 'Like',
            populate: {
              path: 'team',
              model: 'Team'
            }
          }
        ]
      }
    ]);
  },

  async populateTeam(team) {
    return mongoose.model('Team').findById(team._id)
      .populate({ path: 'league' });
  }
};
