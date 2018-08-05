const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true }
  // leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
  // teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

userSchema.statics.register = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // check if user or email already exists
  User.findOne({ email: email }, (err, foundUser) => {
    if (err) return res.status(400).send(err);
    if (foundUser)
      return res
        .status(400)
        .send({ verify: false, message: 'Email has already been taken.' });

    // create new user instance
    let user = new User();

    // hash plaintext password
    bcrypt.hash(password, 10, function(err, hash) {
      // Store hash in db
      user.email = email;
      user.password = hash;
      user.save((err, savedUser) => {
        if (err) return res.status(400).send(err);
        const authToken = _encodeAuthToken(savedUser);
        res.cookie('authToken', authToken);
        next();
      });
    });
  });
};

userSchema.statics.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Missing e-mail or password');
  }
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) return res.status(400).send(err);
    if (!foundUser) {
      return res
        .status(400)
        .send({ verify: false, message: 'Email address not found' });
    }
    bcrypt.compare(req.body.password, foundUser.password, (err, correct) => {
      if (err) return res.status(400).send(err);
      if (!correct) {
        return res
          .status(403)
          .send({ verify: false, message: 'Incorrect password' });
      }
      const authToken = _encodeAuthToken(foundUser);
      res.cookie('authToken', authToken);
      next();
    });
  });
};

_encodeAuthToken = user => {
  let authData = {
    username: user.username,
    email: user.email,
    _id: user._id,
    iat: Date.now()
  };
  return jwt.sign(authData, keys.jwtSecret);
};

const User = mongoose.model('users', userSchema);

module.exports = User;
