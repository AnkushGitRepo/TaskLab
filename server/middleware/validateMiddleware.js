const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Handle express-validator validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ApiError(messages[0], 400));
  }
  next();
};

module.exports = { validate };
