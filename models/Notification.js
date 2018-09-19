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
    type: mongoose.Schema.Types.string,
    required: true
  },
  actingOn: {
    type: mongoose.Schema.Types.string,
    required: true
  },
  hasViewed: {
    type: mongoose.Schema.Types.boolean,
    required: true
  },
  hasDismissed: {
    type: mongoose.Schema.Types.boolean,
    required: true
  },
  date: { type: Date, default: Date.now() }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
