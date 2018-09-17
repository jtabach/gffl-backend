const mongoose = require('mongoose');
const Schema = mongoose.Schema;

likeSchema = new Schema({
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
  date: { type: Date, default: Date.now() }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
