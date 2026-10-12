/* eslint-disable no-undef */
const asyncHandler = require('../utils/asyncHandler');
const { ok, created, paginated } = require('../utils/respond');
const { getPagination, paginatedResponse } = require('../utils/pagination');
const adminService = require('../services/adminService');
const deliveryService = require('../services/deliveryService');
const authService = require('../services/authService');

const dashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboard();
  return ok(res, stats, 'Dashboard stats loaded');
});

const listUsers = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await adminService.listUsers(
    { role: req.query.role, status: req.query.status, search: req.query.search },
    pagination
  );
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Users loaded');
});

const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUser(req.params.id);
  return ok(res, user, 'User loaded');
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  return ok(res, user, 'User updated');
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(req.params.id, req.body.status, req.user.id);
  return ok(res, user, 'User status updated');
});

const createUser = asyncHandler(async (req, res) => {
  const result = await authService.register({ ...req.body, role: req.body.role });
  return created(res, result, 'User created');
});

const listRiders = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const filters = {
    availability: req.query.availability,
    status: req.query.status,
    search: req.query.search,
  };
  if (req.query.isVerified !== undefined) {
    filters.isVerified = req.query.isVerified === 'true';
  }
  const { rows, count } = await adminService.listRiders(filters, pagination);
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Riders loaded');
});

const createRider = asyncHandler(async (req, res) => {
  const rider = await adminService.createRider(req.body);
  return created(res, rider, 'Rider created');
});

const verifyRider = asyncHandler(async (req, res) => {
  const rider = await adminService.verifyRider(req.params.id, req.body.isVerified);
  return ok(res, rider, 'Rider verification updated');
});

const listDeliveries = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const { rows, count } = await deliveryService.listDeliveries(
    {
      status: req.query.status,
      riderId: req.query.riderId,
      customerId: req.query.customerId,
      search: req.query.search,
    },
    pagination
  );
  return paginated(res, paginatedResponse({ rows, count, ...pagination }), 'Deliveries loaded');
});

const assignRider = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.assignRider(
    req.params.id,
    req.body.riderId,
    req.user,
    req.body.note
  );
  return ok(res, delivery, 'Rider assigned');
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
  dashboard,
  listUsers,
  getUser,
  updateUser,
  updateUserStatus,
  createUser,
  listRiders,
  createRider,
  verifyRider,
  listDeliveries,
  assignRider,
  updateDeliveryStatus,
};
