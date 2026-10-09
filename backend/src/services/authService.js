const bcrypt = require('bcryptjs');
const { User, RiderProfile } = require('../models');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/token');
const {
  ROLES,
  USER_STATUS,
  RIDER_AVAILABILITY,
  VEHICLE_TYPE,
} = require('../utils/constants');

/**
 * Registers a customer or rider. Riders get an unverified, offline profile
 * that an admin must activate before they can receive jobs.
 */
async function register(payload) {
  const email = payload.email.toLowerCase();
  const role = payload.role || ROLES.CUSTOMER;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const phoneTaken = await User.findOne({ where: { phone: payload.phone } });
  if (phoneTaken) {
    throw ApiError.conflict('An account with this phone number already exists');
  }

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email,
    phone: payload.phone,
    password: payload.password,
    role,
    status: USER_STATUS.ACTIVE,
  });

  if (role === ROLES.RIDER) {
    await RiderProfile.create({
      userId: user.id,
      availability: RIDER_AVAILABILITY.OFFLINE,
      isVerified: false,
      vehicleType: payload.vehicleType || VEHICLE_TYPE.BIKE,
      licenseNumber: payload.licenseNumber || null,
      vehiclePlateNumber: payload.vehiclePlateNumber || null,
    });
  }

  const fresh = await User.findByPk(user.id, {
    include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
  });

  return { user: fresh, token: signToken(fresh) };
}

/** Verifies credentials and returns the user plus a token. */
async function login(email, password) {
  const user = await User.scope('withPassword').findOne({
    where: { email: email.toLowerCase() },
    include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.status === USER_STATUS.SUSPENDED) {
    throw ApiError.forbidden('Your account has been suspended. Contact support.');
  }
  if (user.status === USER_STATUS.INACTIVE) {
    throw ApiError.forbidden('Your account is inactive. Contact support.');
  }

  const userJson = user.toJSON();
  delete userJson.password;

  return { user: userJson, token: signToken(user) };
}

/** Loads a fresh user by id (password excluded). */
async function getById(id) {
  const user = await User.findByPk(id, {
    include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

/** Changes a password after verifying the current one. */
async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.scope('withPassword').findByPk(userId);
  if (!user) throw ApiError.notFound('User not found');

  const matches = await user.comparePassword(currentPassword);
  if (!matches) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  return true;
}

/** Updates editable profile fields. */
async function updateProfile(userId, payload) {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (payload.phone && payload.phone !== user.phone) {
    const taken = await User.findOne({ where: { phone: payload.phone } });
    if (taken) throw ApiError.conflict('Phone number is already in use');
  }

  ['firstName', 'lastName', 'phone'].forEach((field) => {
    if (payload[field] !== undefined) user[field] = payload[field];
  });

  await user.save();
  return getById(userId);
}

module.exports = { register, login, getById, changePassword, updateProfile };
