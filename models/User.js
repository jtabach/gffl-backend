const mongoose, { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true }
  // leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
  // teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

mongoose.model('users', userSchema);
