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
  createNotification
};

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

            newNotification.save();
          });
        });
      });
    });
  });
}

module.exports = NotificationController;
