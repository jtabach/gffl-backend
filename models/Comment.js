const mongoose = require('mongoose');
const Schema = mongoose.Schema;

commentSchema = new Schema({
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
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now() }
  // likes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Like',
  //     required: true
  //   }
  // ],
  // mentions: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Team'
  //   }
  // ]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
