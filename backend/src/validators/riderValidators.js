const { body } = require('express-validator');
const { RIDER_AVAILABILITY, VEHICLE_TYPE } = require('../utils/constants');

const updateAvailability = [
  body('availability')
    .notEmpty()
    .withMessage('Availability is required')
    .isIn(Object.values(RIDER_AVAILABILITY))
    .withMessage('Availability must be AVAILABLE, BUSY or OFFLINE'),
  body('currentLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('currentLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
];

const updateProfile = [
  body('vehicleType')
    .optional()
    .isIn(Object.values(VEHICLE_TYPE))
    .withMessage('Invalid vehicle type'),
  body('vehiclePlateNumber').optional({ nullable: true }).trim().isLength({ max: 30 }),
  body('licenseNumber').optional({ nullable: true }).trim().isLength({ max: 60 }),
  body('currentLatitude').optional({ nullable: true }).isFloat({ min: -90, max: 90 }),
  body('currentLongitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }),
];

const createRider = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('vehicleType').optional().isIn(Object.values(VEHICLE_TYPE)),
  body('licenseNumber').optional({ nullable: true }).trim(),
  body('vehiclePlateNumber').optional({ nullable: true }).trim(),
  body('isVerified').optional().isBoolean(),
];

module.exports = { updateAvailability, updateProfile, createRider };
