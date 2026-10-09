const asyncHandler = require('../utils/asyncHandler');
const { ok, paginated } = require('../utils/respond');
const { getPagination, paginatedResponse } = require('../utils/pagination');
const riderService = require('../services/riderService');
const deliveryService = require('../services/deliveryService');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await riderService.getProfileOrFail(req.user.id);
  return ok(res, profile, 'Rider profile loaded');
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await riderService.updateProfile(req.user, req.body);
  return ok(res, profile, 'Rider profile updated');
});

const updateAvailability = asyncHandler(async (req, res) => {
  const profile = await riderService.updateAvailability(req.user, req.body);
  return ok(res, profile, 'Availability updated');
});

const availableJobs = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await riderService.listAvailableJobs(pagination);
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Available jobs loaded');
});

const acceptJob = asyncHandler(async (req, res) => {
  const delivery = await riderService.acceptJob(req.user, req.params.id);
  return ok(res, delivery, 'Job accepted');
});

const myDeliveries = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await riderService.listRiderDeliveries(
    req.user.id,
    { status: req.query.status },
    pagination
  );
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Assigned deliveries loaded');
});

const history = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await riderService.listRiderHistory(req.user.id, pagination);
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Delivery history loaded');
});

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.changeStatus(
    req.params.id,
    req.user,
    req.body.status,
    req.body.note
  );
  return ok(res, delivery, 'Delivery status updated');
});

module.exports = {
  getProfile,
  updateProfile,
  updateAvailability,
  availableJobs,
  acceptJob,
  myDeliveries,
  history,
  updateDeliveryStatus,
};
