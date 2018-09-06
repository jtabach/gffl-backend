const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const helper = require('../helpers');
const User = require('../models/User');

// Methods are added to object by dot notation for readability
const AuthController = {};

AuthController.register = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // check if user or email already exists
  mongoose.model('User').findOne({ email: email }, (err, foundUser) => {
    if (err) {
      return res.status(400).send({
        verify: false,
        message: 'Something went wrong. Please try again'
      });
    }
    if (foundUser) {
      return res
        .status(400)
        .send({ verify: false, message: 'Email has already been taken' });
      // return next('Email has already been taken');
    }

    // create new user instance
    let user = new User();
    // hash plaintext password
    bcrypt.hash(password, 10, function(err, hash) {
      // Store hash in db
      user.email = email;
      user.password = hash;
      user.save((err, savedUser) => {
        if (err) {
          return res.status(400).send({
            verify: false,
            message: 'Something went wrong. Please try again'
          });
        }
        const authToken = helper.encodeAuthToken(savedUser);
        res.cookie('authToken', authToken);
        res.user = savedUser;
        return res.send({ user: res.user });
      });
    });
  });
};

AuthController.login = (req, res, next) => {
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
};

module.exports = AuthController;
