const { body, param } = require('express-validator');
const { PACKAGE_SIZE, DELIVERY_STATUS } = require('../utils/constants');

const create = [
  body('pickupLabel').trim().notEmpty().withMessage('Pickup label is required'),
  body('pickupAddress').trim().notEmpty().withMessage('Pickup address is required'),
  body('pickupContactName').trim().notEmpty().withMessage('Pickup contact name is required'),
  body('pickupContactPhone').trim().notEmpty().withMessage('Pickup contact phone is required'),

  body('dropoffLabel').trim().notEmpty().withMessage('Dropoff label is required'),
  body('dropoffAddress').trim().notEmpty().withMessage('Dropoff address is required'),
  body('dropoffContactName').trim().notEmpty().withMessage('Dropoff contact name is required'),
  body('dropoffContactPhone').trim().notEmpty().withMessage('Dropoff contact phone is required'),

  body('packageDescription').trim().notEmpty().withMessage('Package description is required'),
  body('packageSize')
    .notEmpty()
    .withMessage('Package size is required')
    .isIn(Object.values(PACKAGE_SIZE))
    .withMessage('Package size must be SMALL, MEDIUM or LARGE'),
  body('packageWeight').optional({ nullable: true }).isFloat({ min: 0 }),
  body('distanceKm').optional({ nullable: true }).isFloat({ min: 0 }),

  body('pickupLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('pickupLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
  body('dropoffLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('dropoffLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),

  body('scheduledPickupAt').optional({ nullable: true }).isISO8601().withMessage('Invalid date'),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 1000 }),
];

const update = [
  body('pickupLabel').optional().trim().notEmpty(),
  body('pickupAddress').optional().trim().notEmpty(),
  body('pickupContactName').optional().trim().notEmpty(),
  body('pickupContactPhone').optional().trim().notEmpty(),
  body('dropoffLabel').optional().trim().notEmpty(),
  body('dropoffAddress').optional().trim().notEmpty(),
  body('dropoffContactName').optional().trim().notEmpty(),
  body('dropoffContactPhone').optional().trim().notEmpty(),
  body('packageDescription').optional().trim().notEmpty(),
  body('packageSize').optional().isIn(Object.values(PACKAGE_SIZE)),
  body('packageWeight').optional({ nullable: true }).isFloat({ min: 0 }),
  body('distanceKm').optional({ nullable: true }).isFloat({ min: 0 }),
  body('pickupLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('pickupLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
  body('dropoffLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('dropoffLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
  body('scheduledPickupAt').optional({ nullable: true }).isISO8601(),
  body('notes').optional({ nullable: true }).trim().isLength({ max: 1000 }),
];

const changeStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(DELIVERY_STATUS))
    .withMessage('Invalid delivery status'),
  body('note').optional({ nullable: true }).trim().isLength({ max: 255 }),
];

const cancel = [body('reason').optional({ nullable: true }).trim().isLength({ max: 255 })];

const quote = [
  body('packageSize')
    .notEmpty()
    .withMessage('Package size is required')
    .isIn(Object.values(PACKAGE_SIZE)),
  body('distanceKm').optional({ nullable: true }).isFloat({ min: 0 }),
  body('pickupLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('pickupLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
  body('dropoffLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('dropoffLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];
const trackingParam = [param('trackingCode').trim().notEmpty()];

module.exports = { create, update, changeStatus, cancel, quote, idParam, trackingParam };
