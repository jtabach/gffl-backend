const mongoose = require('mongoose');
const Schema = mongoose.Schema;

notificationSchema = new Schema({
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
  hasViewed: {
    type: Boolean,
    required: true
  },
  hasDismissed: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  notificationType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['PostOnTimeline']
  }
});

const PostOnTimeline = mongoose.model('PostOnTimeline', new Schema({
  actingOn: {
    type: String,
    required: true
  }
}));

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
