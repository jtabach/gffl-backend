module.exports = (err, req, res, next) => {
  if (req.xhr) {
    const { status, message } = err;

    res.status(status || 500).send(message);
  } else {
    next(err);
  }
};
