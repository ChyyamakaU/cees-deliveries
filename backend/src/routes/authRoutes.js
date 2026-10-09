const express = require('express');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const authValidators = require('../validators/authValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authValidators.register, validate, authController.register);
router.post('/login', authValidators.login, validate, authController.login);
router.get('/me', authenticate, authController.me);
router.patch('/me', authenticate, authValidators.updateProfile, validate, authController.updateProfile);
router.patch(
  '/me/password',
  authenticate,
  authValidators.changePassword,
  validate,
  authController.changePassword
);

module.exports = router;
