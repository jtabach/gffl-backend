const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

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
  }
};
