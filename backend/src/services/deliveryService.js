const { Op } = require('sequelize');
const sequelize = require('../config/database');
const {
  Delivery,
  DeliveryStatusHistory,
  Payment,
  User,
  RiderProfile,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { assertTransition, nextStatuses } = require('../utils/stateMachine');
const { resolveDistanceKm, calculateFee, PRICING } = require('../utils/pricing');
const {
  ROLES,
  DELIVERY_STATUS,
  USER_STATUS,
  RIDER_AVAILABILITY,
  PAYMENT_STATUS,
  PREPAID_METHODS,
  EDITABLE_STATUSES,
  NON_CANCELLABLE_STATUSES,
} = require('../utils/constants');

const publicUserAttrs = ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'status'];

function deliveryInclude() {
  return [
    { model: User, as: 'customer', attributes: publicUserAttrs },
    {
      model: User,
      as: 'rider',
      attributes: publicUserAttrs,
      include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
    },
    { model: Payment, as: 'payment' },
    {
      model: DeliveryStatusHistory,
      as: 'statusHistory',
      separate: true,
      order: [['createdAt', 'ASC']],
      include: [{ model: User, as: 'changedBy', attributes: ['id', 'firstName', 'lastName', 'role'] }],
    },
  ];
}

/** Writes an entry to the delivery timeline. */
async function recordHistory(delivery, status, changedById, note, options = {}) {
  await DeliveryStatusHistory.create(
    {
      deliveryId: delivery.id,
      status,
      previousStatus: delivery.previous('status') || null,
      changedById: changedById || null,
      note: note || null,
    },
    options
  );
}

function buildDeliveryAttributes(payload) {
  const distanceKm = resolveDistanceKm(payload);
  const deliveryFee = calculateFee({ distanceKm, packageSize: payload.packageSize });

  const attrs = {
    pickupLabel: payload.pickupLabel,
    pickupAddress: payload.pickupAddress,
    pickupContactName: payload.pickupContactName,
    pickupContactPhone: payload.pickupContactPhone,
    pickupLatitude: payload.pickupLatitude ?? null,
    pickupLongitude: payload.pickupLongitude ?? null,
    dropoffLabel: payload.dropoffLabel,
    dropoffAddress: payload.dropoffAddress,
    dropoffContactName: payload.dropoffContactName,
    dropoffContactPhone: payload.dropoffContactPhone,
    dropoffLatitude: payload.dropoffLatitude ?? null,
    dropoffLongitude: payload.dropoffLongitude ?? null,
    packageDescription: payload.packageDescription,
    packageSize: payload.packageSize,
    packageWeight: payload.packageWeight ?? null,
    distanceKm,
    deliveryFee,
    currency: PRICING.currency,
    scheduledPickupAt: payload.scheduledPickupAt || null,
    notes: payload.notes || null,
  };

  return attrs;
}

async function createDelivery(customerId, payload) {
  return sequelize.transaction(async (transaction) => {
    const delivery = await Delivery.create(
      { ...buildDeliveryAttributes(payload), customerId, status: DELIVERY_STATUS.PENDING },
      { transaction }
    );

    await DeliveryStatusHistory.create(
      {
        deliveryId: delivery.id,
        status: DELIVERY_STATUS.PENDING,
        previousStatus: null,
        changedById: customerId,
        note: 'Delivery request created',
      },
      { transaction }
    );

    return Delivery.findByPk(delivery.id, { include: deliveryInclude(), transaction });
  });
}

async function getDeliveryOrFail(id, options = {}) {
  const delivery = await Delivery.findByPk(id, { include: deliveryInclude(), ...options });
  if (!delivery) throw ApiError.notFound('Delivery not found');
  return delivery;
}

/** Loads a delivery and enforces access based on role. */
async function getDeliveryForUser(id, user) {
  const delivery = await getDeliveryOrFail(id);

  if (user.role === ROLES.ADMIN) return delivery;
  if (user.role === ROLES.CUSTOMER && delivery.customerId === user.id) return delivery;
  if (user.role === ROLES.RIDER && delivery.riderId === user.id) return delivery;

  throw ApiError.forbidden('You do not have access to this delivery');
}

async function getDeliveryByTrackingCode(trackingCode) {
  const delivery = await Delivery.findOne({
    where: { trackingCode },
    include: deliveryInclude(),
  });
  if (!delivery) throw ApiError.notFound('No delivery found for that tracking code');
  return delivery;
}

async function listDeliveries(filters = {}, pagination = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.customerId) where.customerId = filters.customerId;
  if (filters.riderId) where.riderId = filters.riderId;
  if (filters.search) {
    where.trackingCode = { [Op.iLike]: `%${filters.search}%` };
  }

  const { rows, count } = await Delivery.findAndCountAll({
    where,
    include: [
      { model: User, as: 'customer', attributes: publicUserAttrs },
      { model: User, as: 'rider', attributes: publicUserAttrs },
      { model: Payment, as: 'payment' },
    ],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });

  return { rows, count };
}

async function updateDelivery(id, user, payload) {
  const delivery = await getDeliveryOrFail(id);

  if (user.role !== ROLES.ADMIN && delivery.customerId !== user.id) {
    throw ApiError.forbidden('You do not own this delivery');
  }

  if (!EDITABLE_STATUSES.includes(delivery.status)) {
    throw ApiError.conflict('Delivery can no longer be edited in its current status');
  }

  const editable = [
    'pickupLabel',
    'pickupAddress',
    'pickupContactName',
    'pickupContactPhone',
    'pickupLatitude',
    'pickupLongitude',
    'dropoffLabel',
    'dropoffAddress',
    'dropoffContactName',
    'dropoffContactPhone',
    'dropoffLatitude',
    'dropoffLongitude',
    'packageDescription',
    'packageSize',
    'packageWeight',
    'scheduledPickupAt',
    'notes',
  ];

  editable.forEach((field) => {
    if (payload[field] !== undefined) delivery[field] = payload[field];
  });

  const distanceKm = resolveDistanceKm({
    distanceKm: payload.distanceKm,
    pickupLatitude: delivery.pickupLatitude,
    pickupLongitude: delivery.pickupLongitude,
    dropoffLatitude: delivery.dropoffLatitude,
    dropoffLongitude: delivery.dropoffLongitude,
  });

  if (payload.distanceKm !== undefined || payload.packageSize !== undefined) {
    delivery.distanceKm = distanceKm;
    delivery.deliveryFee = calculateFee({
      distanceKm,
      packageSize: delivery.packageSize,
    });
  }

  await delivery.save();
  return getDeliveryOrFail(id);
}

/** Central lifecycle transition with permission + side-effect handling. */
async function changeStatus(id, user, newStatus, note) {
  return sequelize.transaction(async (transaction) => {
    const delivery = await Delivery.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!delivery) throw ApiError.notFound('Delivery not found');

    const payment = await Payment.findOne({ where: { deliveryId: id }, transaction });

    const isAdmin = user.role === ROLES.ADMIN;
    const isCustomer = user.role === ROLES.CUSTOMER && delivery.customerId === user.id;
    const isRider = user.role === ROLES.RIDER && delivery.riderId === user.id;

    if (newStatus === DELIVERY_STATUS.CANCELLED) {
      return cancelDeliveryInternal(delivery, user, note, transaction);
    }

    assertTransition(delivery.status, newStatus);

    if (newStatus === DELIVERY_STATUS.CONFIRMED) {
      if (!isAdmin && !isCustomer) {
        throw ApiError.forbidden('Only the customer or an admin can confirm a delivery');
      }
      delivery.confirmedAt = new Date();
    } else if ([DELIVERY_STATUS.PICKED_UP, DELIVERY_STATUS.IN_TRANSIT, DELIVERY_STATUS.DELIVERED].includes(newStatus)) {
      if (!isAdmin && !isRider) {
        throw ApiError.forbidden('Only the assigned rider or an admin can update this delivery');
      }

      if (!delivery.riderId) {
        throw ApiError.conflict('Delivery has no assigned rider');
      }

      // Prepaid deliveries must be settled before pickup.
      if (newStatus === DELIVERY_STATUS.PICKED_UP && payment) {
        const { method, status } = payment;
        if (PREPAID_METHODS.includes(method) && status !== PAYMENT_STATUS.SUCCESSFUL) {
          throw ApiError.conflict(
            'Payment must be successful before this delivery can be picked up'
          );
        }
      }

      if (newStatus === DELIVERY_STATUS.PICKED_UP) delivery.pickedUpAt = new Date();
      if (newStatus === DELIVERY_STATUS.IN_TRANSIT) delivery.inTransitAt = new Date();
      if (newStatus === DELIVERY_STATUS.DELIVERED) delivery.deliveredAt = new Date();
    } else {
      throw ApiError.badRequest(`Cannot manually set status to ${newStatus}`);
    }

    const previousStatus = delivery.status;
    delivery.status = newStatus;
    await delivery.save({ transaction });

    await DeliveryStatusHistory.create(
      {
        deliveryId: delivery.id,
        status: newStatus,
        previousStatus,
        changedById: user.id,
        note: note || null,
      },
      { transaction }
    );

    if (newStatus === DELIVERY_STATUS.DELIVERED && delivery.riderId) {
      const profile = await RiderProfile.findOne({
        where: { userId: delivery.riderId },
        transaction,
      });
      if (profile) {
        profile.totalDeliveries += 1;
        if (profile.availability === RIDER_AVAILABILITY.BUSY) {
          profile.availability = RIDER_AVAILABILITY.AVAILABLE;
        }
        await profile.save({ transaction });
      }
    }

    return getDeliveryOrFail(id, { transaction });
  });
}

/** Shared cancellation routine (used by changeStatus and cancel endpoint). */
async function cancelDeliveryInternal(delivery, user, reason, transaction) {
  if (NON_CANCELLABLE_STATUSES.includes(delivery.status)) {
    throw ApiError.conflict(`A ${delivery.status.toLowerCase()} delivery cannot be cancelled`);
  }

  const isAdmin = user.role === ROLES.ADMIN;
  const isCustomer = delivery.customerId === user.id;
  const isRider = delivery.riderId === user.id;

  // Once a package is picked up only an admin can cancel.
  if ([DELIVERY_STATUS.PICKED_UP, DELIVERY_STATUS.IN_TRANSIT].includes(delivery.status)) {
    if (!isAdmin) {
      throw ApiError.forbidden('Only an admin can cancel a delivery already in progress');
    }
  } else if (!isAdmin && !isCustomer && !isRider) {
    throw ApiError.forbidden('You are not allowed to cancel this delivery');
  }

  const previousStatus = delivery.status;
  delivery.status = DELIVERY_STATUS.CANCELLED;
  delivery.cancellationReason = reason || 'Cancelled';
  delivery.cancelledAt = new Date();
  await delivery.save({ transaction });

  // Refund a settled payment automatically.
  const payment = await Payment.findOne({ where: { deliveryId: delivery.id }, transaction });
  if (payment && payment.status === PAYMENT_STATUS.SUCCESSFUL) {
    payment.status = PAYMENT_STATUS.REFUNDED;
    payment.refundedAt = new Date();
    await payment.save({ transaction });
  }

  // Free up the rider if they were busy on this job.
  if (delivery.riderId) {
    const profile = await RiderProfile.findOne({
      where: { userId: delivery.riderId },
      transaction,
    });
    if (profile && profile.availability === RIDER_AVAILABILITY.BUSY) {
      profile.availability = RIDER_AVAILABILITY.AVAILABLE;
      await profile.save({ transaction });
    }
  }

  await DeliveryStatusHistory.create(
    {
      deliveryId: delivery.id,
      status: DELIVERY_STATUS.CANCELLED,
      previousStatus,
      changedById: user.id,
      note: reason || 'Delivery cancelled',
    },
    { transaction }
  );

  return getDeliveryOrFail(delivery.id, { transaction });
}

async function cancelDelivery(id, user, reason) {
  return sequelize.transaction(async (transaction) => {
    const delivery = await Delivery.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!delivery) throw ApiError.notFound('Delivery not found');
    return cancelDeliveryInternal(delivery, user, reason, transaction);
  });
}

/**
 * Admin assigns (or reassigns) a rider. Only verified, active riders who are
 * AVAILABLE can take a job. Assigning flips their availability to BUSY.
 */
async function assignRider(deliveryId, riderId, admin, note) {
  return sequelize.transaction(async (transaction) => {
    const delivery = await Delivery.findByPk(deliveryId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!delivery) throw ApiError.notFound('Delivery not found');

    if (NON_CANCELLABLE_STATUSES.includes(delivery.status)) {
      throw ApiError.conflict('Cannot assign a rider to a completed or cancelled delivery');
    }
    if (delivery.status === DELIVERY_STATUS.PENDING) {
      throw ApiError.conflict('Confirm the delivery before assigning a rider');
    }

    const rider = await User.findOne({
      where: { id: riderId, role: ROLES.RIDER },
      include: [{ model: RiderProfile, as: 'riderProfile', required: false }],
      transaction,
    });
    if (!rider) throw ApiError.notFound('Rider not found');

    if (rider.status !== USER_STATUS.ACTIVE) {
      throw ApiError.conflict('This rider account is not active');
    }
    if (!rider.riderProfile || !rider.riderProfile.isVerified) {
      throw ApiError.conflict('This rider is not verified yet');
    }

    const alreadyAssigned = Number(delivery.riderId) === Number(riderId);
    if (!alreadyAssigned) {
      if (rider.riderProfile.availability !== RIDER_AVAILABILITY.AVAILABLE) {
        throw ApiError.conflict('This rider is not currently available');
      }

      // Releasing a previously assigned rider.
      if (delivery.riderId) {
        const previous = await RiderProfile.findOne({
          where: { userId: delivery.riderId },
          transaction,
        });
        if (previous && previous.availability === RIDER_AVAILABILITY.BUSY) {
          previous.availability = RIDER_AVAILABILITY.AVAILABLE;
          await previous.save({ transaction });
        }
      }

      rider.riderProfile.availability = RIDER_AVAILABILITY.BUSY;
      await rider.riderProfile.save({ transaction });
    }

    const wasConfirmed = delivery.status === DELIVERY_STATUS.CONFIRMED;
    delivery.riderId = rider.id;
    if (wasConfirmed) {
      delivery.status = DELIVERY_STATUS.ASSIGNED;
      delivery.assignedAt = new Date();
    }
    await delivery.save({ transaction });

    await DeliveryStatusHistory.create(
      {
        deliveryId: delivery.id,
        status: delivery.status,
        previousStatus: wasConfirmed ? DELIVERY_STATUS.CONFIRMED : delivery.status,
        changedById: admin.id,
        note: note || `Rider ${rider.firstName} ${rider.lastName} assigned`,
      },
      { transaction }
    );

    return getDeliveryOrFail(deliveryId, { transaction });
  });
}

module.exports = {
  createDelivery,
  getDeliveryOrFail,
  getDeliveryForUser,
  getDeliveryByTrackingCode,
  listDeliveries,
  updateDelivery,
  changeStatus,
  cancelDelivery,
  assignRider,
  buildDeliveryAttributes,
  nextStatuses,
};
