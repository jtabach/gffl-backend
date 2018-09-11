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

function createComment(req, res, next) {
  const { text, leagueId, teamId, postId } = req.body;

  const newComment = new Comment();

  newComment.text = text;
  newComment.league = leagueId;
  newComment.team = teamId;
  newComment.post = postId;

  mongoose.model('Post').findById(postId, (err, post) => {
    if (err) return res.status(400).send(err);

    post.comments.push(newComment);
    post.save((err, savedPost) => {
      if (err) return res.status(400).send(err);

      newComment.save((err, savedComment) => {
        if (err) return res.status(400).send(err);

        savedComment.populate('team', err => {
          if (err) return res.status(400).send(err);

          return res.status(200).send({ comment: savedComment });
        });
      });
    });
  });
}

module.exports = CommentController;
