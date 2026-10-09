const { body, query } = require('express-validator');
const { USER_STATUS, ROLES } = require('../utils/constants');

const updateUser = [
  body('firstName').optional().trim().notEmpty().isLength({ max: 80 }),
  body('lastName').optional().trim().notEmpty().isLength({ max: 80 }),
  body('phone').optional().trim().isLength({ min: 7, max: 30 }),
  body('role').optional().isIn(Object.values(ROLES)),
];

const updateUserStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(USER_STATUS))
    .withMessage('Status must be ACTIVE, INACTIVE or SUSPENDED'),
];

const assignRider = [
  body('riderId').isInt({ min: 1 }).withMessage('A valid riderId is required'),
  body('note').optional({ nullable: true }).trim().isLength({ max: 255 }),
];

const verifyRider = [
  body('isVerified').isBoolean().withMessage('isVerified must be a boolean'),
];

const createUser = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role'),
];

const listUsersQuery = [
  query('role').optional().isIn(Object.values(ROLES)),
  query('status').optional().isIn(Object.values(USER_STATUS)),
];

module.exports = {
  updateUser,
  updateUserStatus,
  assignRider,
  verifyRider,
  createUser,
  listUsersQuery,
};
