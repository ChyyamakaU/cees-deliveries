const express = require('express');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/constants');
const paymentValidators = require('../validators/paymentValidators');
const deliveryValidators = require('../validators/deliveryValidators');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(ROLES.ADMIN), paymentController.list);
router.get('/:id', deliveryValidators.idParam, validate, paymentController.getOne);
router.patch(
  '/:id/status',
  deliveryValidators.idParam,
  paymentValidators.updateStatus,
  validate,
  paymentController.updateStatus
);

module.exports = router;
