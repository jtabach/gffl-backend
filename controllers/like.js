const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

const LikeController = {
  likePost,
  deleteLikePost
};

async function likePost(req, res, next) {
  const { leagueId, teamId, postId } = req.body;

  const newLike = new Like();

  newLike.league = leagueId;
  newLike.team = teamId;
  newLike.post = postId;

  try {
    const foundPost = await mongoose.model('Post').findById(postId);
    foundPost.likes.push(newLike);
    await foundPost.save();

    const savedLike = await newLike.save();
    const populatedLike = await mongoose.model('Like').findById(savedLike._id).populate({ path: 'team' });

    return res.status(200).send({ like: populatedLike });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function deleteLikePost(req, res, next) {
  const like = req.body;

  try {
    const foundPost = await mongoose.model('Post').findById(like.postId);
    foundPost.likes = foundPost.likes.filter(likeInPost => {
      return likeInPost != like._id;
    });
    await foundPost.save();

    const deletedLike = await mongoose.model('Like').findByIdAndRemove(like._id);

    return res.status(200).send({ like: deletedLike });
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = LikeController;
