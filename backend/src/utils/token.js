const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET) {
  throw new Error('JWT_SECRET is not set. Copy .env.example to .env and configure it.');
}

/** Signs a short-lived access token for a user. */
function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

/** Verifies a token and returns its payload, or throws a 401. */
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired authentication token');
  }
}

module.exports = { signToken, verifyToken };
