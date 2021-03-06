const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');

// Methods are added to object by refence to function for
// quick readability of controller methods
const UserController = {
  getUser,
  getTeams
};

async function getUser(req, res, next) {
  const { authToken } = req.cookies;
  const user = helper.decodeAuthToken(authToken);

  if (!user) {
    res.status(400);
    return next(new Error('User not found'));
  }
  let populatedUser;

  try {
    populatedUser = await helper.populateUser(user).catch((error) => {
      throw 'Failed to fetch user';
    });
    const safeUserObject = helper.getSafeUserObject(populatedUser._doc);

    return res.status(200).send({ user: safeUserObject });
  } catch (err) {
    res.status(400);
    return next(new Error(err));
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
