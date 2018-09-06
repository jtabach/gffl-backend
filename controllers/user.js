const mongoose = require('mongoose');

const helper = require('../helpers');

// Methods are added to object by dot notation for readability
const UserController = {};

UserController.getUser = (req, res, next) => {
  const { authToken } = req.cookies;
  const user = helper.decodeAuthToken(authToken);
  if (!user) {
    return res.status(400).send({ user: user });
  } else {
    helper.populateUser(user, res, next);
  }
};

module.exports = UserController;
