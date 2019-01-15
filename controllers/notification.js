const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Notification = require('../models/Notification');

const NotificationController = {
  getNotifications,
  createPostOnTimelineNotification,
  createLikeOnPostNotification,
  viewNotification,
  viewAllNotifications,
  dismissNotifications
};

async function getNotifications(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);

  try {
    const foundUser = await mongoose.model('User').findById(user._id);
    const populatedUser = await helper.populateUserWithNotifications(foundUser);

    return res
      .status(200)
      .send({ notifications: populatedUser.notifications || [] });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function createPostOnTimelineNotification(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  const { leagueId, verb, actingOn, actor } = req.body;
  // TODO: since actor is passed from client verify perms to create notification

  try {
    const foundLeague = await mongoose.model('League').findById(leagueId);
    const populatedLeague = await mongoose.model('League').findById(leagueId).populate({ path: 'teams'});

    populatedLeague.teams.forEach(async team => {
      const foundUser = await mongoose.model('User').findById(team.user);

      // TODO: check if user preferences for recieving notification
      if (actor != team.user) {
        const postOnTimeline = await mongoose.model('PostOnTimeline')
          .create({ actingOn: 'timeline' });

        const newPostOnTimelineNotification = await mongoose.model('Notification')
          .create({
            verb: verb,
            actor: actor,
            league: leagueId,
            hasViewed: false,
            hasDismissed: false,
            date: Date.now(),
            notificationType: postOnTimeline._id,
            onModel: 'PostOnTimeline'
          });

        foundUser.notifications.push(newPostOnTimelineNotification);
        await foundUser.save();
        await newPostOnTimelineNotification.save();
      }
    });

    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function createLikeOnPostNotification(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  const { leagueId, verb, actingOn, actor, patient, postId } = req.body;
  // TODO: since actor is passed from client verify perms to create notification

  if (actor != patient) {
    try {
      const foundUser = await mongoose.model('User').findById(patient);

      const likeOnPost = await mongoose.model('LikeOnPost')
      .create({
        actingOn: actingOn,
        post: postId,
        patient: patient
      });

      const newLikeOnPostNotification = await mongoose.model('Notification')
      .create({
        verb: verb,
        actor: actor,
        league: leagueId,
        hasViewed: false,
        hasDismissed: false,
        date: Date.now(),
        notificationType: likeOnPost._id,
        onModel: 'LikeOnPost'
      });

      foundUser.notifications.push(newLikeOnPostNotification);
      await foundUser.save();
      await newLikeOnPostNotification.save();

      return res.status(200).send({ success: true });
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

async function viewNotification(req, res, next) {
  const notification = req.body;

  try {
    const foundNotification = await mongoose.model('Notification').findById(notification._id)
    foundNotification.hasViewed = true;
    const savedNotification = await foundNotification.save();

    return res.status(200).send({ notification: savedNotification });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// TODO: DRY shares logic with dismissNotifications
async function viewAllNotifications(req, res, next) {
  const notifications = req.body;

  try {
    const savedNotifications = await _changeAllNotificationsFlag(notifications, 'hasViewed');

    return res.status(200).send({ notifications: savedNotifications });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function dismissNotifications(req, res, next) {
  const notifications = req.body;

  try {
    const savedNotifications = await _changeAllNotificationsFlag(notifications, 'hasDismissed');

    return res.status(200).send({ notifications: savedNotifications });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function _changeAllNotificationsFlag(notifications, property) {
  return notifications.map(async notification => {
    const foundNotification = await mongoose.model('Notification').findById(notification._id);
    foundNotification[property] = true;
    const savedNotification = await foundNotification.save();
    return savedNotification;
  });
}

module.exports = NotificationController;
