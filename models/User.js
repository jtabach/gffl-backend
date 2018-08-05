const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true }
  // leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
  // teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

userSchema.statics.register = (req, res, next) => {
  console.log(req);
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  console.log(email, password);

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
      user.save(err => {
        if (err) return res.status(400).send(err);
        next();
      });
    });
  });
};

const User = mongoose.model('users', userSchema);

module.exports = User;
