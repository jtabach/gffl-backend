const mongoose = require('mongoose');
const Schema = mongoose.Schema;

postSchema = new Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
      required: true
    }
  ]
  // mentions: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Team'
  //   }
  // ]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
