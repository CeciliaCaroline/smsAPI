"use strict";

// catch 404 error and forward to error handler
module.exports.handle404Errors = () => {
  return ((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });
};

// Error Handler
module.exports.handleErrors = () => {
  return ((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
  });
};
