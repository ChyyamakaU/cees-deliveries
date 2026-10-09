const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const riderValidators = require('../validators/riderValidators');
const deliveryValidators = require('../validators/deliveryValidators');
const riderController = require('../controllers/riderController');

const router = express.Router();

router.use(authenticate, authorize(ROLES.RIDER));

router.get('/profile', riderController.getProfile);
router.patch('/profile', riderValidators.updateProfile, validate, riderController.updateProfile);
router.patch(
  '/availability',
  riderValidators.updateAvailability,
  validate,
  riderController.updateAvailability
);

router.get('/jobs', riderController.availableJobs);
router.post('/jobs/:id/accept', deliveryValidators.idParam, validate, riderController.acceptJob);

router.get('/deliveries/history', riderController.history);
router.get('/deliveries', riderController.myDeliveries);
router.patch(
  '/deliveries/:id/status',
  deliveryValidators.idParam,
  deliveryValidators.changeStatus,
  validate,
  riderController.updateDeliveryStatus
);

module.exports = router;
