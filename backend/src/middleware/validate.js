const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Collects express-validator errors and forwards a single 422 with a
 * field-keyed details object the frontend can render inline.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const details = {};
  for (const error of result.array()) {
    const key = error.path || error.param || 'general';
    if (!details[key]) details[key] = error.msg;
  }

  return next(ApiError.unprocessable('Validation failed', details));
}

module.exports = validate;
