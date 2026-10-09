const { User, RiderProfile } = require('../models');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/token');
const { USER_STATUS, ROLES } = require('../utils/constants');

/**
 * Verifies the Bearer token, loads the account and blocks non-active users.
 * Attaches `req.user` (a Sequelize instance, password excluded).
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw ApiError.unauthorized('Missing bearer token');
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
    });

    if (!user) {
      throw ApiError.unauthorized('Account no longer exists');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw ApiError.forbidden('Your account has been suspended. Contact support.');
    }

    if (user.status === USER_STATUS.INACTIVE) {
      throw ApiError.forbidden('Your account is inactive. Contact support.');
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Role gate. Usage: authorize(ROLES.ADMIN) or authorize(ROLES.ADMIN, ROLES.RIDER). */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (roles.length && !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have access to this resource'));
    }
    return next();
  };
}

/** Requires the current user to own the resource or be an admin. */
function authorizeOwnerOrAdmin(getOwnerId) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (req.user.role === ROLES.ADMIN) return next();
    const ownerId = getOwnerId(req);
    if (Number(ownerId) !== Number(req.user.id)) {
      return next(ApiError.forbidden('You do not own this resource'));
    }
    return next();
  };
}

module.exports = { authenticate, authorize, authorizeOwnerOrAdmin };
