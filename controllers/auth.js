const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const helper = require('../helpers');
const User = require('../models/User');

// Methods are added to object by refence to function for
// quick readability of controller methods
const AuthController = {
  register,
  login,
  logout
};

async function register(req, res, next) {
  let { email, firstName, lastName } = req.body;
  email = email.toLowerCase();
  const password = req.body.password;

  // check if user or email already exists
  const foundUser = await mongoose.model('User').findOne({ email: email });
  if (foundUser) {
    return res
      .status(400)
      .send({ verify: false, message: 'Email has already been taken' });
  }

  let user = new User();

  const hash = await bcrypt.hash(password, 10);

  user.email = email;
  user.password = hash;
  user.firstName = firstName;
  user.lastName = lastName;
  user.notificationSettings = helper.setNotificationSettings();

  try {
    const savedUser = await user.save();
    const authToken = helper.encodeAuthToken(savedUser);
    res.cookie('authToken', authToken);
    const safeUserObject = helper.getSafeUserObject(savedUser._doc);
    return res.status(200).send({ user: safeUserObject });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function login(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400);
    return next(new Error('Incorrect e-mail or password'));
  }

  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    res.status(400);
    return next(new Error('Incorrect e-mail or password'));
  }

  const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
  if (!isMatch) {
    res.status(400);
    return next(new Error('Incorrect e-mail or password'));
  }

  const authToken = helper.encodeAuthToken(foundUser);
  res.cookie('authToken', authToken);

  let populatedUser;
  let safeUserObject;
  try {
    populatedUser = await helper.populateUser(foundUser).catch((error) => {
      throw 'Failed to fetch user';
    });
    safeUserObject = helper.getSafeUserObject(populatedUser._doc);

    return res.status(200).send({ user: safeUserObject });
  } catch (err) {
    res.status(500);
    return next(new Error(err));
  }
}

function logout(req, res, next) {
  res.clearCookie('authToken');
  return res.status(200).send({ user: false });
}

module.exports = AuthController;
