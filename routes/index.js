var express = require('express');
var router = express.Router();

module.exports = app => {
  app.get('/', (req, res, next) => {
    res.send('hello gffl');
  });
};
