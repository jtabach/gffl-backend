const passport = require('passport');

const User = require('../models/User');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.send(req.user);
    }
  );

  app.post(
    '/auth/register',
    // some function for registering the user and saving to the DB
    // callback for logging the user in and returning a jwt,
    // User.register,
    (req, res) => {
      console.log(req, res);
    }
  );

  app.post(
    '/auth/login',
    // some function for logging in the user and returning a jwt
    (req, res) => {
      console.log(req.body);
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout();
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
