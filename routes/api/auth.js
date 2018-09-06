const passport = require('passport');
const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/auth');
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

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

router.get('/user', User.getUser, (req, res) => {
  res.send({ user: res.user });
});

// For passport google user (deprecated)
// router.get('/current_user', (req, res) => {
//   res.send(req.user);
// });

module.exports = router;
