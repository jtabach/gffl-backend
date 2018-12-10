const mongoose = require('mongoose');

const News = require('../models/News');

const NewsController = {
  getPlayerNews
};

let CACHE = {};
let CACHE_TIME = 60000;

async function getPlayerNews(req, res, next) {
  if (CACHE.playerNews && (Date.now() - CACHE.playerNews.lastUpdated) < CACHE_TIME) {
    return res.status(200).send({ news: CACHE.playerNews.content });;
  }

  const data = await mongoose.model('News').findOne();

  CACHE.playerNews = {
    content: data.players,
    lastUpdated: Date.now()
  };

  return res.status(200).send({ news: data.players });
}


module.exports = NewsController;
