const { Op, fn, col } = require('sequelize');
const {
  User,
  RiderProfile,
  Delivery,
  Payment,
} = require('../models');
const ApiError = require('../utils/ApiError');
const {
  ROLES,
  USER_STATUS,
  RIDER_AVAILABILITY,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  VEHICLE_TYPE,
} = require('../utils/constants');

async function groupCount(model, column) {
  const rows = await model.findAll({
    attributes: [column, [fn('COUNT', col('id')), 'count']],
    group: [column],
    raw: true,
  });
  return rows.reduce((acc, row) => {
    acc[row[column]] = Number(row.count);
    return acc;
  }, {});
}

/** Aggregated metrics for the admin dashboard. */
async function getDashboard() {
  const [
    usersByRole,
    usersByStatus,
    totalUsers,
    ridersByAvailability,
    deliveriesByStatus,
    totalDeliveries,
    paymentsByStatus,
    successfulPayments,
    revenue,
  ] = await Promise.all([
    groupCount(User, 'role'),
    groupCount(User, 'status'),
    User.count(),
    groupCount(RiderProfile, 'availability'),
    groupCount(Delivery, 'status'),
    Delivery.count(),
    groupCount(Payment, 'status'),
    Payment.count({ where: { status: PAYMENT_STATUS.SUCCESSFUL } }),
    Payment.sum('amount', { where: { status: PAYMENT_STATUS.SUCCESSFUL } }),
  ]);

  const verifiedRiders = await RiderProfile.count({ where: { isVerified: true } });

  const activeDeliveries =
    (deliveriesByStatus[DELIVERY_STATUS.ASSIGNED] || 0) +
    (deliveriesByStatus[DELIVERY_STATUS.PICKED_UP] || 0) +
    (deliveriesByStatus[DELIVERY_STATUS.IN_TRANSIT] || 0);

  return {
    users: {
      total: totalUsers,
      byRole: {
        customers: usersByRole[ROLES.CUSTOMER] || 0,
        riders: usersByRole[ROLES.RIDER] || 0,
        admins: usersByRole[ROLES.ADMIN] || 0,
      },
      byStatus: usersByStatus,
    },
    riders: {
      total: usersByRole[ROLES.RIDER] || 0,
      verified: verifiedRiders,
      byAvailability: {
        available: ridersByAvailability[RIDER_AVAILABILITY.AVAILABLE] || 0,
        busy: ridersByAvailability[RIDER_AVAILABILITY.BUSY] || 0,
        offline: ridersByAvailability[RIDER_AVAILABILITY.OFFLINE] || 0,
      },
    },
    deliveries: {
      total: totalDeliveries,
      active: activeDeliveries,
      byStatus: deliveriesByStatus,
    },
    payments: {
      byStatus: paymentsByStatus,
      successfulCount: successfulPayments,
      totalRevenue: Number(revenue || 0),
    },
  };
}

async function listUsers(filters = {}, pagination = {}) {
  const where = {};
  if (filters.role) where.role = filters.role;
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${filters.search}%` } },
      { lastName: { [Op.iLike]: `%${filters.search}%` } },
      { email: { [Op.iLike]: `%${filters.search}%` } },
      { phone: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const { rows, count } = await User.findAndCountAll({
    where,
    include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });

  return { rows, count };
}

async function getUser(id) {
  const user = await User.findByPk(id, {
    include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

async function updateUser(id, payload) {
  const user = await getUser(id);

  if (payload.phone && payload.phone !== user.phone) {
    const taken = await User.findOne({ where: { phone: payload.phone } });
    if (taken) throw ApiError.conflict('Phone number is already in use');
  }

  ['firstName', 'lastName', 'phone', 'role'].forEach((field) => {
    if (payload[field] !== undefined) user[field] = payload[field];
  });

  await user.save();
  return getUser(id);
}

async function updateUserStatus(id, status, actingAdminId) {
  if (Number(id) === Number(actingAdminId)) {
    throw ApiError.conflict('You cannot change your own account status');
  }

  const user = await getUser(id);

  // Suspending or deactivating a rider also takes them offline.
  if (user.riderProfile && status !== USER_STATUS.ACTIVE) {
    if (user.riderProfile.availability !== RIDER_AVAILABILITY.OFFLINE) {
      user.riderProfile.availability = RIDER_AVAILABILITY.OFFLINE;
      await user.riderProfile.save();
    }
  }

  user.status = status;
  await user.save();
  return getUser(id);
}

async function listRiders(filters = {}, pagination = {}) {
  const userWhere = {};
  if (filters.search) {
    userWhere[Op.or] = [
      { firstName: { [Op.iLike]: `%${filters.search}%` } },
      { lastName: { [Op.iLike]: `%${filters.search}%` } },
      { email: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }
  if (filters.status) userWhere.status = filters.status;

  const profileWhere = {};
  if (filters.availability) profileWhere.availability = filters.availability;
  if (filters.isVerified !== undefined) profileWhere.isVerified = filters.isVerified;

  const { rows, count } = await RiderProfile.findAndCountAll({
    where: profileWhere,
    include: [{ model: User, as: 'user', where: userWhere, attributes: { exclude: ['password'] } }],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });

  return { rows, count };
}

async function verifyRider(userId, isVerified) {
  const profile = await RiderProfile.findOne({ where: { userId } });
  if (!profile) throw ApiError.notFound('Rider profile not found');

  profile.isVerified = isVerified;
  if (!isVerified) profile.availability = RIDER_AVAILABILITY.OFFLINE;
  await profile.save();

  return RiderProfile.findOne({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });
}

async function createRider(payload) {
  const email = payload.email.toLowerCase();
  const existing = await User.findOne({ where: { email } });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email,
    phone: payload.phone,
    password: payload.password || 'Rider@123',
    role: ROLES.RIDER,
    status: USER_STATUS.ACTIVE,
  });

  await RiderProfile.create({
    userId: user.id,
    vehicleType: payload.vehicleType || VEHICLE_TYPE.BIKE,
    licenseNumber: payload.licenseNumber || null,
    vehiclePlateNumber: payload.vehiclePlateNumber || null,
    isVerified: payload.isVerified ?? false,
    availability: RIDER_AVAILABILITY.OFFLINE,
  });

  return getUser(user.id);
}

module.exports = {
  getDashboard,
  listUsers,
  getUser,
  updateUser,
  updateUserStatus,
  listRiders,
  verifyRider,
  createRider,
};
