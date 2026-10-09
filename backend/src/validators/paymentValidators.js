const { body } = require('express-validator');
const { PAYMENT_METHOD, PAYMENT_STATUS } = require('../utils/constants');

const create = [
  body('method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(Object.values(PAYMENT_METHOD))
    .withMessage('Method must be CASH, CARD or TRANSFER'),
  body('amount').optional({ nullable: true }).isFloat({ min: 0 }),
];

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage('Invalid payment status'),
  body('transactionId').optional({ nullable: true }).trim().isLength({ max: 80 }),
];

module.exports = { create, updateStatus };
