const passport = require('passport');
const express = require('express');
const router = express.Router();

const User = require('../../models/User');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
});

router.post(
  '/register',
  // some function for registering the user and saving to the DB
  // callback for logging the user in and returning a jwt,
  User.register,
  (req, res) => {
    res.send({ verify: true, message: 'Registered successfully' });
  }
);

router.post(
  '/login',
  // some function for logging in the user and returning a jwt
  (req, res) => {
    console.log(req.body);
  }
);

router.get('/logout', (req, res) => {
  req.logout();
});

router.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
