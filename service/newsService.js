const mongoose = require('mongoose');

const News = require('../models/News');
const helper = require('../helpers');

const NEWS_FETCH_INTERVAL = 600000;

module.exports = {
  init
};

function init(io) {
  io.on('connection', function (socket) {
    console.log('connected');
    socket.emit('news', 'connected to player news');

    getMostRecentPlayerNews(socket);
    setInterval(() => getMostRecentPlayerNews(socket), NEWS_FETCH_INTERVAL);

    socket.on('disconnect', function () {
      console.log('ok disconnecting');
    });
  });
}

async function getMostRecentPlayerNews(socket) {
  const newNews = await mongoose.model('News').findOne();

  const data = await helper.asyncRequest({
      url: "http://api.fantasy.nfl.com/v1/players/news?format=json&count=20",
      method: "GET"
  }).then(response => JSON.parse(response));

  newNews.players = data.news;

  const updatedNews = await newNews.save();
  socket.emit('updated news', {news: updatedNews.players });
}
