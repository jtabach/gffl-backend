const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const helper = require('../helpers');

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
