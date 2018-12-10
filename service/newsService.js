const mongoose = require('mongoose');
const request = require('request');

const News = require('../models/News');

module.exports = {
  init
};

function init() {
  getMostRecentPlayerNews();
  setInterval(getMostRecentPlayerNews, 60000 * 10);
}

async function getMostRecentPlayerNews() {
  const newNews = await mongoose.model('News').findOne();

  const data = await _requestHelper({
      url: "http://api.fantasy.nfl.com/v1/players/news?format=json&count=20",
      method: "GET"
  }).then(response => JSON.parse(response));

  newNews.players = data.news;

  newNews.save();
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
