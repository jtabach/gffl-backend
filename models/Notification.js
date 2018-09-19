const mongoose = require('mongoose');
const Schema = mongoose.Schema;

notificationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  verb: {
    type: String,
    required: true
  },
  actingOn: {
    type: String,
    required: true
  },
  hasViewed: {
    type: Boolean,
    required: true
  },
  hasDismissed: {
    type: Boolean,
    required: true
  },
  date: { type: Date, default: Date.now() }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
