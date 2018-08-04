module.exports = app => {
  app.get('/', (req, res, next) => {
    res.send('worker demo2');
  });
};
