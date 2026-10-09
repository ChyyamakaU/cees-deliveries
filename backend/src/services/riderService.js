const { Op } = require('sequelize');
const { Delivery, RiderProfile, User, Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const deliveryService = require('./deliveryService');
const {
  ROLES,
  DELIVERY_STATUS,
  RIDER_AVAILABILITY,
  USER_STATUS,
} = require('../utils/constants');

const ACTIVE_RIDER_STATUSES = [
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.PICKED_UP,
  DELIVERY_STATUS.IN_TRANSIT,
];

async function getProfileOrFail(userId) {
  const profile = await RiderProfile.findOne({
    where: { userId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'status'],
      },
    ],
  });
  if (!profile) throw ApiError.notFound('Rider profile not found');
  return profile;
}

async function countActiveDeliveries(userId) {
  return Delivery.count({
    where: { riderId: userId, status: { [Op.in]: ACTIVE_RIDER_STATUSES } },
  });
}

/** Updates availability while enforcing status/active-job consistency. */
async function updateAvailability(user, payload) {
  const profile = await getProfileOrFail(user.id);
  const activeCount = await countActiveDeliveries(user.id);
  const target = payload.availability;

  if (profile.isVerified !== true) {
    throw ApiError.forbidden('Your rider account is not verified yet');
  }

  if (target === RIDER_AVAILABILITY.BUSY && activeCount === 0) {
    throw ApiError.conflict('You have no active deliveries to be marked busy');
  }

  if (target !== RIDER_AVAILABILITY.BUSY && activeCount > 0) {
    throw ApiError.conflict(
      'You have active deliveries. Finish them before changing to ' + target
    );
  }

  profile.availability = target;
  if (payload.currentLatitude !== undefined) profile.currentLatitude = payload.currentLatitude;
  if (payload.currentLongitude !== undefined) profile.currentLongitude = payload.currentLongitude;

  await profile.save();
  return getProfileOrFail(user.id);
}

async function updateProfile(user, payload) {
  const profile = await getProfileOrFail(user.id);

  ['vehicleType', 'vehiclePlateNumber', 'licenseNumber', 'currentLatitude', 'currentLongitude'].forEach(
    (field) => {
      if (payload[field] !== undefined) profile[field] = payload[field];
    }
  );

  await profile.save();
  return getProfileOrFail(user.id);
}

/** Jobs a rider can pick up: confirmed and not yet assigned. */
async function listAvailableJobs(pagination = {}) {
  const { rows, count } = await Delivery.findAndCountAll({
    where: { status: DELIVERY_STATUS.CONFIRMED, riderId: null },
    include: [{ model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'phone'] }],
    order: [['createdAt', 'ASC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });
  return { rows, count };
}

/** Rider self-assigns an unassigned, confirmed job. */
async function acceptJob(user, deliveryId) {
  const profile = await getProfileOrFail(user.id);

  if (profile.isVerified !== true) {
    throw ApiError.forbidden('Your rider account is not verified yet');
  }
  if (profile.availability !== RIDER_AVAILABILITY.AVAILABLE) {
    throw ApiError.conflict('You must be AVAILABLE to accept a job');
  }

  const delivery = await Delivery.findByPk(deliveryId);
  if (!delivery) throw ApiError.notFound('Delivery not found');
  if (delivery.status !== DELIVERY_STATUS.CONFIRMED || delivery.riderId) {
    throw ApiError.conflict('This delivery is no longer available');
  }

  return deliveryService.assignRider(deliveryId, user.id, user, 'Rider accepted the job');
}

async function listRiderDeliveries(riderId, filters = {}, pagination = {}) {
  const where = { riderId };
  if (filters.status) {
    where.status = filters.status;
  }
  const { rows, count } = await Delivery.findAndCountAll({
    where,
    include: [
      { model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'phone'] },
      { model: Payment, as: 'payment' },
    ],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });
  return { rows, count };
}

async function listRiderHistory(riderId, pagination = {}) {
  const { rows, count } = await Delivery.findAndCountAll({
    where: {
      riderId,
      status: { [Op.in]: [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.CANCELLED] },
    },
    include: [{ model: User, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'phone'] }],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });
  return { rows, count };
}

module.exports = {
  getProfileOrFail,
  updateAvailability,
  updateProfile,
  listAvailableJobs,
  acceptJob,
  listRiderDeliveries,
  listRiderHistory,
  countActiveDeliveries,
};
