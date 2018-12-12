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
  createNotification,
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

function createNotification(req, res, next) {
  let { authToken } = req.cookies;
  let user = helper.decodeAuthToken(authToken);
  const { leagueId, verb, actingOn } = req.body;
  const actor = user._id;

  // find all teams by league Id + populate Users in Team
  mongoose.model('League').findById(leagueId, (err, foundLeague) => {
    if (err) return res.status(400).send(err);

    foundLeague.populate('teams', (err, populatedLeague) => {
      if (err) return res.status(400).send(err);

      var completed = []; // TODO: fix temporary resolver for looping through async actions

      populatedLeague.teams.forEach(team => {
        mongoose.model('User').findById(team.user, (err, foundUser) => {
          if (err) return res.status(400).send(err);

          // TODO: check if user preferences for recieving notification
          // TODO: check if user is also the actor
          const newNotification = new Notification();

          newNotification.user = foundUser._id;
          newNotification.verb = verb;
          newNotification.actor = actor;
          newNotification.league = leagueId;
          newNotification.actingOn = actingOn;
          newNotification.hasViewed = false;
          newNotification.hasDismissed = false;

          foundUser.notifications.push(newNotification);
          foundUser.save(err => {
            if (err) return res.status(400).send(err);

            newNotification.save(err => {
              if (err) return res.status(400).send(err);

              completed.push('done'); // TODO: fix temporary resolver for looping through async actions
              if (completed.length == populatedLeague.teams.length) {
                return res.status(200).send({ success: true });
              }
            });
          });
        });
      });
    });
  });
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
    const savedNotifications = notifications.map(async notification => {
      const foundNotification = await mongoose.model('Notification').findById(notification._id);
      foundNotification.hasViewed = true;
      const savedNotification = await foundNotification.save();
      return savedNotification;
    })

    return res.status(200).send({ notifications: savedNotifications });
  } catch (err) {
    return res.status(400).send(err);
  }
}

function dismissNotifications(req, res, next) {
  const notifications = req.body;
  var savedNotifications = []; // TODO: fix temporary resolver for looping through async actions

  notifications.forEach(notification => {
    mongoose
      .model('Notification')
      .findById(notification._id, (err, foundNotification) => {
        if (err) return res.status(400).send(err);

        foundNotification.hasDismissed = true;
        foundNotification.save((err, savedNotification) => {
          savedNotifications.push(savedNotification); // TODO: fix temporary resolver for looping through async actions

          if (savedNotifications.length == notifications.length) {
            return res.status(200).send({ notifications: savedNotifications });
          }
        });
      });
  });
}

module.exports = NotificationController;
