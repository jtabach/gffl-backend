module.exports = (err, req, res, next) => {
  const { status, message } = err;

  res.status(status || 500).send(message);
};
