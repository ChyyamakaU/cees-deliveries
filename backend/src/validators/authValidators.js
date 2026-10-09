const { body } = require('express-validator');
const { ROLES, VEHICLE_TYPE } = require('../utils/constants');

const register = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 80 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 7, max: 30 })
    .withMessage('Phone number looks invalid'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn([ROLES.CUSTOMER, ROLES.RIDER])
    .withMessage('Role must be CUSTOMER or RIDER'),
  body('vehicleType')
    .optional()
    .isIn(Object.values(VEHICLE_TYPE))
    .withMessage('Invalid vehicle type'),
  body('licenseNumber').optional().trim().isLength({ max: 60 }),
  body('vehiclePlateNumber').optional().trim().isLength({ max: 30 }),
];

const login = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfile = [
  body('firstName').optional().trim().notEmpty().isLength({ max: 80 }),
  body('lastName').optional().trim().notEmpty().isLength({ max: 80 }),
  body('phone').optional().trim().isLength({ min: 7, max: 30 }),
];

const changePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

module.exports = { register, login, updateProfile, changePassword };
