const asyncHandler = require('../utils/asyncHandler');
const { ok, created, paginated } = require('../utils/respond');
const { getPagination, paginatedResponse } = require('../utils/pagination');
const paymentService = require('../services/paymentService');

const payForDelivery = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.params.id, req.user, req.body);
  return created(res, payment, 'Payment initiated');
});

const getOne = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentForUser(req.params.id, req.user);
  return ok(res, payment, 'Payment loaded');
});

const list = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await paymentService.listPayments(
    { status: req.query.status, method: req.query.method },
    pagination
  );
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Payments loaded');
});

const updateStatus = asyncHandler(async (req, res) => {
  const payment = await paymentService.updatePaymentStatus(
    req.params.id,
    req.user,
    req.body.status,
    req.body.transactionId
  );
  return ok(res, payment, 'Payment status updated');
});

module.exports = { payForDelivery, getOne, list, updateStatus };
