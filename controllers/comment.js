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

  try {
    const post = await mongoose.model('Post').findById(postId);
    post.comments.push(newComment);

    await post.save();
    const savedComment = await newComment.save();
    const populatedComment = await mongoose.model('Post').populate(savedComment, {
      path: 'team',
      model: 'Team'
    });

    return res.status(200).send({ comment: populatedComment });
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = CommentController;
