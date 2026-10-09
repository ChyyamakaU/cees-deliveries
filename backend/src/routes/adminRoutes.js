const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const adminValidators = require('../validators/adminValidators');
const riderValidators = require('../validators/riderValidators');
const deliveryValidators = require('../validators/deliveryValidators');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.dashboard);

// Users
router.get('/users', adminValidators.listUsersQuery, validate, adminController.listUsers);
router.post('/users', adminValidators.createUser, validate, adminController.createUser);
router.get('/users/:id', deliveryValidators.idParam, validate, adminController.getUser);
router.patch('/users/:id', deliveryValidators.idParam, adminValidators.updateUser, validate, adminController.updateUser);
router.patch(
  '/users/:id/status',
  deliveryValidators.idParam,
  adminValidators.updateUserStatus,
  validate,
  adminController.updateUserStatus
);

// Riders
router.get('/riders', adminController.listRiders);
router.post('/riders', riderValidators.createRider, validate, adminController.createRider);
router.patch(
  '/riders/:id/verify',
  deliveryValidators.idParam,
  adminValidators.verifyRider,
  validate,
  adminController.verifyRider
);

// Deliveries
router.get('/deliveries', adminController.listDeliveries);
router.patch(
  '/deliveries/:id/assign',
  deliveryValidators.idParam,
  adminValidators.assignRider,
  validate,
  adminController.assignRider
);
router.patch(
  '/deliveries/:id/status',
  deliveryValidators.idParam,
  deliveryValidators.changeStatus,
  validate,
  adminController.updateDeliveryStatus
);

module.exports = router;
