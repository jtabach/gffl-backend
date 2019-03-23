module.exports = (err, req, res, next) => {
  res.status(500);
  // TODO: not ideal behaviour
  res.render('error', { error: err });
};
