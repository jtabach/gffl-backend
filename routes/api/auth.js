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

router.post('/register', User.register, (req, res) => {
  res.send({ user: res.user });
});

router.post('/login', User.login, (req, res) => {
  res.send({ user: res.user });
});

router.post('/logout', User.logout, (req, res) => {
  res.send({ user: res.user });
});

router.get('/user', User.getUser, (req, res) => {
  res.send({ user: res.user });
});

router.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
