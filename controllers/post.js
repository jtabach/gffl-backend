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

async function createPost(req, res, next) {
  const { text, leagueId, teamId } = req.body;

  const newPost = new Post();

  newPost.text = text;
  newPost.league = leagueId;
  newPost.team = teamId;
  newPost.date = Date.now();

  try {
    const league = await mongoose.model('League').findById(leagueId);
    league.posts.push(newPost._id);

    const savedLeague = await league.save();
    const savedPost = await newPost.save();
    const populatedPost = await mongoose.model('Post').populate(savedPost, {
      path: 'team',
      model: 'Team'
    });
    return res.status(200).send({ post: populatedPost });
  } catch (err) {
    return res.status(400).send(err);
  }
}

async function deletePost(req, res, next) {
  const post = req.body;

  try {
    await mongoose.model('Comment').deleteMany({ _id: post.comments });
    await mongoose.model('Like').deleteMany({ _id: post.likes });
    const deletedPost = await mongoose.model('Post').findByIdAndRemove(post._id);
    const foundLeague = await mongoose.model('League').findById(post.league);

    foundLeague.posts = foundLeague.posts.filter(leaguePost => {
      return post._id != leaguePost._id;
    });

    await foundLeague.save();
    return res.status(200).send({ post: deletedPost });
  } catch (err) {
    return res.status(400).send(err);
  }
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
          },
          {
            path: 'likes',
            model: 'Like',
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
