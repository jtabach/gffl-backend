const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');
const User = require('../models/User');
const League = require('../models/League');
const Post = require('../models/Post');

const PostController = {
  createPost,
  deletePost,
  editPost
};

function createPost(req, res, next) {
  const { text, leagueId, teamId } = req.body;

  const newPost = new Post();

  newPost.text = text;
  newPost.league = leagueId;
  newPost.team = teamId;

  mongoose.model('League').findById(leagueId, (err, league) => {
    if (err) return res.status(400).send(err);

    league.posts.push(newPost._id);
    league.save((err, savedLeague) => {
      if (err) return res.status(400).send(err);

      newPost.save((err, savedPost) => {
        if (err) return res.status(400).send(err);

        savedPost.populate('team', (err, populatedPost) => {
          return res.status(200).send({ post: populatedPost });
        });
      });
    });
  });
}

function deletePost(req, res, next) {
  const post = req.body;

  mongoose.model('Comment').deleteMany({ _id: post.comments }, err => {
    if (err) return res.status(400).send(err);

    mongoose.model('Post').findByIdAndRemove(post._id, (err, deletedPost) => {
      if (err) return res.status(400).send(err);

      return res.status(200).send({ post: deletedPost });
    });
  });
}

function editPost(req, res, next) {
  const post = req.body;

  mongoose.model('Post').findById(post._id, (err, foundPost) => {
    if (err) return res.status(400).send(err);

    foundPost.text = post.text;
    foundPost.save((err, savedPost) => {
      if (err) return res.status(400).send(err);

      savedPost.populate(
        [
          {
            path: 'team',
            model: 'Team'
          },
          {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'team',
              model: 'Team'
            }
          }
        ],
        (err, populatedPost) => {
          return res.status(200).send({ post: populatedPost });
        }
      );
    });
  });
}

module.exports = PostController;
