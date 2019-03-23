const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const CommentController = {
  createComment
};

async function createComment(req, res, next) {
  const { text, leagueId, teamId, postId } = req.body;

  const newComment = new Comment();

  newComment.text = text;
  newComment.league = leagueId;
  newComment.team = teamId;
  newComment.post = postId;
  newComment.date = Date.now();

  let post;
  let savedComment;
  let populatedComment;

  try {
    post = await mongoose
      .model('Post')
      .findById(postId)
      .catch((error) => {
        throw 'Failed to find post';
      });
    post.comments.push(newComment);

    await post.save().catch((error) => {
      throw 'Failed to save post';
    });

    savedComment = await newComment.save().catch((error) => {
      throw 'Failed to save comment';
    });

    populatedComment = await mongoose
      .model('Post')
      .populate(savedComment, {
        path: 'team',
        model: 'Team',
        populate: {
          path: 'user',
          model: 'User'
        }
      })
      .catch((error) => {
        throw 'Failed to populate comment';
      });

    return res.status(200).send({ comment: populatedComment });
  } catch (err) {
    res.status(500);
    return next(new Error(err));
  }
}

module.exports = CommentController;
