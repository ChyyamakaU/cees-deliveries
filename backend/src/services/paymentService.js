const { Delivery } = require('../models');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const {
  ROLES,
  DELIVERY_STATUS,
  PAYMENT_STATUS,
  NON_CANCELLABLE_STATUSES,
} = require('../utils/constants');

/** Allowed payment status transitions. */
const PAYMENT_TRANSITIONS = {
  [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.SUCCESSFUL, PAYMENT_STATUS.FAILED],
  [PAYMENT_STATUS.FAILED]: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCESSFUL],
  [PAYMENT_STATUS.SUCCESSFUL]: [PAYMENT_STATUS.REFUNDED],
  [PAYMENT_STATUS.REFUNDED]: [],
};

function assertPaymentTransition(from, to) {
  const allowed = PAYMENT_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw ApiError.conflict(`Invalid payment transition from ${from} to ${to}`, {
      allowed,
    });
  }
}

/** Creates the single payment attached to a delivery. */
async function createPayment(deliveryId, user, payload) {
  const delivery = await Delivery.findByPk(deliveryId);
  if (!delivery) throw ApiError.notFound('Delivery not found');

  if (user.role !== ROLES.ADMIN && delivery.customerId !== user.id) {
    throw ApiError.forbidden('You do not own this delivery');
  }

  if (delivery.status === DELIVERY_STATUS.CANCELLED) {
    throw ApiError.conflict('Cannot create a payment for a cancelled delivery');
  }

  const existing = await Payment.findOne({ where: { deliveryId } });
  if (existing) {
    throw ApiError.conflict('A payment already exists for this delivery');
  }

  const amount = payload.amount ?? delivery.deliveryFee;

  const payment = await Payment.create({
    deliveryId,
    amount,
    currency: delivery.currency,
    method: payload.method,
    status: PAYMENT_STATUS.PENDING,
  });

  return payment;
}

async function getPaymentForUser(id, user) {
  const payment = await Payment.findByPk(id, {
    include: [{ model: Delivery, as: 'delivery' }],
  });
  if (!payment) throw ApiError.notFound('Payment not found');

  if (user.role === ROLES.ADMIN) return payment;
  if (user.role === ROLES.CUSTOMER && payment.delivery.customerId === user.id) return payment;
  if (user.role === ROLES.RIDER && payment.delivery.riderId === user.id) return payment;

  throw ApiError.forbidden('You do not have access to this payment');
}

async function listPayments(filters = {}, pagination = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.method) where.method = filters.method;

  const { rows, count } = await Payment.findAndCountAll({
    where,
    include: [{ model: Delivery, as: 'delivery' }],
    order: [['createdAt', 'DESC']],
    limit: pagination.limit,
    offset: pagination.offset,
    distinct: true,
  });

  return { rows, count };
}

/** Moves a payment through its own state machine. */
async function updatePaymentStatus(paymentId, user, newStatus, transactionId) {
  const payment = await getPaymentForUser(paymentId, user);

  assertPaymentTransition(payment.status, newStatus);

  if (newStatus === PAYMENT_STATUS.REFUNDED && user.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only an admin can refund a payment');
  }

  if (newStatus === PAYMENT_STATUS.REFUNDED && payment.status !== PAYMENT_STATUS.SUCCESSFUL) {
    throw ApiError.conflict('Only a successful payment can be refunded');
  }

  payment.status = newStatus;
  if (transactionId) payment.transactionId = transactionId;

  if (newStatus === PAYMENT_STATUS.SUCCESSFUL) {
    payment.paidAt = payment.paidAt || new Date();
    if (!payment.transactionId) {
      payment.transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;
    }
  }
  if (newStatus === PAYMENT_STATUS.REFUNDED) {
    payment.refundedAt = new Date();
  }

  await payment.save();
  return payment.reload({ include: [{ model: Delivery, as: 'delivery' }] });
}

async function getDeliveryPayment(deliveryId, user) {
  const delivery = await Delivery.findByPk(deliveryId);
  if (!delivery) throw ApiError.notFound('Delivery not found');

  if (user.role !== ROLES.ADMIN && delivery.customerId !== user.id && delivery.riderId !== user.id) {
    throw ApiError.forbidden('You do not have access to this delivery');
  }

  const payment = await Payment.findOne({ where: { deliveryId } });
  return payment;
}

module.exports = {
  createPayment,
  getPaymentForUser,
  listPayments,
  updatePaymentStatus,
  getDeliveryPayment,
  assertPaymentTransition,
};
