const mongoose = require('mongoose');
const request = require('request');

const News = require('../models/News');

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

  const data = await _requestHelper({
      url: "http://api.fantasy.nfl.com/v1/players/news?format=json&count=20",
      method: "GET"
  }).then(response => JSON.parse(response));

  newNews.players = data.news;

  const updatedNews = await newNews.save();
  socket.emit('updated news', {news: updatedNews.players });
}

function _requestHelper(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(body);
      }
    })
  })
}
