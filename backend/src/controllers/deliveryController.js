const asyncHandler = require('../utils/asyncHandler');
const { ok, created, paginated } = require('../utils/respond');
const { getPagination, paginatedResponse } = require('../utils/pagination');
const deliveryService = require('../services/deliveryService');
const paymentService = require('../services/paymentService');
const { resolveDistanceKm, calculateFee, PRICING } = require('../utils/pricing');
const { ROLES } = require('../utils/constants');

const create = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.createDelivery(req.user.id, req.body);
  return created(res, delivery, 'Delivery request created');
});

const list = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const filters = { status: req.query.status, search: req.query.search };

  if (req.user.role === ROLES.CUSTOMER) {
    filters.customerId = req.user.id;
  } else if (req.user.role === ROLES.RIDER) {
    filters.riderId = req.user.id;
  } else if (req.query.customerId) {
    filters.customerId = req.query.customerId;
  }

  const { rows, count } = await deliveryService.listDeliveries(filters, pagination);
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Deliveries loaded');
});

const getOne = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.getDeliveryForUser(req.params.id, req.user);
  return ok(res, delivery, 'Delivery loaded');
});

const track = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.getDeliveryByTrackingCode(req.params.trackingCode);
  return ok(res, delivery, 'Delivery loaded');
});

const update = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.updateDelivery(req.params.id, req.user, req.body);
  return ok(res, delivery, 'Delivery updated');
});

const changeStatus = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.changeStatus(
    req.params.id,
    req.user,
    req.body.status,
    req.body.note
  );
  return ok(res, delivery, 'Delivery status updated');
});

const cancel = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.cancelDelivery(req.params.id, req.user, req.body.reason);
  return ok(res, delivery, 'Delivery cancelled');
});

const quote = asyncHandler(async (req, res) => {
  const distanceKm = resolveDistanceKm(req.body);
  const fee = calculateFee({ distanceKm, packageSize: req.body.packageSize });
  return ok(
    res,
    { distanceKm, deliveryFee: fee, currency: PRICING.currency, pricing: PRICING },
    'Quote calculated'
  );
});

const getHistory = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.getDeliveryForUser(req.params.id, req.user);
  return ok(res, delivery.statusHistory || [], 'Delivery timeline loaded');
});

const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getDeliveryPayment(req.params.id, req.user);
  return ok(res, payment, 'Payment loaded');
});

module.exports = {
  create,
  list,
  getOne,
  track,
  update,
  changeStatus,
  cancel,
  quote,
  getHistory,
  getPayment,
};
