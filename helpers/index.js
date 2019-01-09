const jwt = require('jsonwebtoken');
const request = require('request');
const mongoose = require('mongoose');

const keys = require('../config/keys');

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

  getSafeUserObject(userObject) {
    const { password, ...safeUserObject } = userObject;
    return safeUserObject;
  },

  structureEspnCookieString(s2, swid) {
    return `espn_s2=${s2}; SWID=${swid}`;
  },

  asyncRequest(options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          resolve(body);
        }
      })
    })
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

  async populateUserWithNotifications(user) {
    return mongoose.model('User').findById(user._id)
      .populate([
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
