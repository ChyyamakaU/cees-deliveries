const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const deliveryValidators = require('../validators/deliveryValidators');
const paymentValidators = require('../validators/paymentValidators');
const deliveryController = require('../controllers/deliveryController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Public tracking by code.
router.get(
  '/track/:trackingCode',
  deliveryValidators.trackingParam,
  validate,
  deliveryController.track
);

router.use(authenticate);

router.post(
  '/quote',
  deliveryValidators.quote,
  validate,
  deliveryController.quote
);

router.post(
  '/',
  authorize(ROLES.CUSTOMER, ROLES.ADMIN),
  deliveryValidators.create,
  validate,
  deliveryController.create
);

router.get('/', deliveryController.list);

router.get('/:id', deliveryValidators.idParam, validate, deliveryController.getOne);
router.patch(
  '/:id',
  deliveryValidators.idParam,
  deliveryValidators.update,
  validate,
  deliveryController.update
);
router.get(
  '/:id/history',
  deliveryValidators.idParam,
  validate,
  deliveryController.getHistory
);
router.get(
  '/:id/payment',
  deliveryValidators.idParam,
  validate,
  deliveryController.getPayment
);
router.post(
  '/:id/payments',
  authorize(ROLES.CUSTOMER, ROLES.ADMIN),
  deliveryValidators.idParam,
  paymentValidators.create,
  validate,
  paymentController.payForDelivery
);
router.patch(
  '/:id/status',
  deliveryValidators.idParam,
  deliveryValidators.changeStatus,
  validate,
  deliveryController.changeStatus
);
router.post(
  '/:id/cancel',
  deliveryValidators.idParam,
  deliveryValidators.cancel,
  validate,
  deliveryController.cancel
);

module.exports = router;
