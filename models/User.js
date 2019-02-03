const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }
  ],
  notificationSettings: {
    postOnTimeline: {
      type: Boolean,
      default: true
    },
    commentOnPost: {
      type: Boolean,
      default: true
    },
    likeOnPost: {
      type: Boolean,
      default: true
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
