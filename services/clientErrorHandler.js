module.exports = (err, req, res, next) => {
  console.log('xhr', req.xhr);

  const { status, message } = err;

  res.status(status || 500).send(message);
};
