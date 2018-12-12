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

function likePost(req, res, next) {
  const { leagueId, teamId, postId } = req.body;

  const newLike = new Like();

  newLike.league = leagueId;
  newLike.team = teamId;
  newLike.post = postId;

  mongoose.model('Post').findById(postId, (err, foundPost) => {
    if (err) return res.status(400).send(err);

    foundPost.likes.push(newLike);
    foundPost.save(err => {
      if (err) return res.status(400).send(err);

      newLike.save((err, savedLike) => {
        if (err) return res.status(400).send(err);

        savedLike.populate('team', (err, populateLike) => {
          if (err) return res.status(400).send(err);

          return res.status(200).send({ like: populateLike });
        });
      });
    });
  });
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
    res.status(400).send(err);
  }
}

module.exports = LikeController;
