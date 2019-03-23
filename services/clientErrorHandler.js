module.exports = (err, req, res, next) => {
  if (req.xhr) {
    res.status(res.statusCode || 500).send(err.message);
  } else {
    next(err);
  }
};
