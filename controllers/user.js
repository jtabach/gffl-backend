const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');

// Methods are added to object by refence to function for
// quick readability of controller methods
const UserController = {
  getUser,
  getTeams
};

function getUser(req, res, next) {
  const { authToken } = req.cookies;
  const user = helper.decodeAuthToken(authToken);
  if (!user) {
    return res.status(400).send({ user: user });
  } else {
    helper.populateUser(user, res, next);
  }
}

// TODO: remove due to redundancy, of getUser
function getTeams(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  mongoose
    .model('Team')
    .find({ user: user._id })
    .populate('league')
    .exec((err, teams) => {
      return res.status(200).send({ teams: teams || [] });
    });
}

module.exports = UserController;
