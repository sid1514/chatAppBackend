const notFound = (req, res, next) => {
  const error = new error(`Not Found-${req.originalUrl}`);
  res.status(404);
  next(error);
};


module.exports = { notFound };
