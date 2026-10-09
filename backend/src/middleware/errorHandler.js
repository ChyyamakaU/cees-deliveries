const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError');

/** Maps known Sequelize errors onto clean ApiErrors. */
function normaliseError(err) {
  if (err instanceof ApiError) return err;

  if (err instanceof UniqueConstraintError) {
    const fields = err.errors.map((e) => e.path).join(', ');
    return ApiError.conflict(`A record with the same ${fields || 'value'} already exists`);
  }

  if (err instanceof ValidationError) {
    const details = {};
    err.errors.forEach((e) => {
      details[e.path] = e.message;
    });
    return ApiError.unprocessable('Validation failed', details);
  }

  if (err instanceof ForeignKeyConstraintError) {
    return ApiError.badRequest('Related record does not exist or is still referenced');
  }

  return null;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const known = normaliseError(err);
  const apiError = known || new ApiError(500, 'Something went wrong on our end');

  const status = apiError.statusCode || 500;
  if (status >= 500) {
    // Surface unexpected stack traces during development only.
    if (process.env.NODE_ENV !== 'production') {
      console.error(err);
    }
  }

  res.status(status).json({
    success: false,
    message: apiError.message,
    ...(apiError.details ? { errors: apiError.details } : {}),
    ...(process.env.NODE_ENV !== 'production' && status >= 500
      ? { stack: err.stack }
      : {}),
  });
}

module.exports = errorHandler;
