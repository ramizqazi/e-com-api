exports.notFound = (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Not found',
  });
};

exports.logErrors = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Error Message: ', err.message);
  // eslint-disable-next-line no-console
  console.error('Error Stack: ', err.stack);
  next(err);
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  res.status(500).send({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to process the request',
  });
};
