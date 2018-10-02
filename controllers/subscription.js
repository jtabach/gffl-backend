const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

const SubscriptionController = {
  saveSubscription
};

function saveSubscription(req, res, next) {
  const subscription = req.body;
  // TODO: save subscription to database
}

module.exports = SubscriptionController;
