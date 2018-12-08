const mongoose = require('mongoose');
const Schema = mongoose.Schema;

newsSchema = new Schema({
  players: {
    type: Object
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
