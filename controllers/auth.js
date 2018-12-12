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
  const email = req.body.email.toLowerCase();
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

  try {
    const savedUser = await user.save();
    const authToken = helper.encodeAuthToken(savedUser);
    res.cookie('authToken', authToken);
    return res.status(200).send({ user: savedUser });
  } catch (err) {
    return res.status(400).send(err);
  }
}

function login(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ user: false, message: 'Missing e-mail or password' });
  }
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(400).send(err);
    if (!foundUser) {
      return res
        .status(400)
        .send({ user: false, message: 'Email address not found' });
    }
    bcrypt.compare(req.body.password, foundUser.password, (err, correct) => {
      if (err) return res.status(400).send(err);
      if (!correct) {
        return res
          .status(403)
          .send({ user: false, message: 'Incorrect password' });
      }
      const authToken = helper.encodeAuthToken(foundUser);

      res.cookie('authToken', authToken);
      // TODO: Don't send the user hashed password to the client
      helper.populateUser(foundUser, res, next);
    });
  });
}

function logout(req, res, next) {
  res.clearCookie('authToken');
  return res.status(200).send({ user: false });
}

module.exports = AuthController;
