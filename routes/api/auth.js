// const passport = require('passport');
const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// For passport google user (deprecated)
// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email']
//   })
// );

// For passport google user (deprecated)
// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.send(req.user);
// });

// For passport google user (deprecated)
// router.get('/current_user', (req, res) => {
//   res.send(req.user);
// });

module.exports = router;
