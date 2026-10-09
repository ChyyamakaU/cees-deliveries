const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/respond');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return created(res, result, 'Account created successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return ok(res, result, 'Logged in successfully');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getById(req.user.id);
  return ok(res, user, 'Profile loaded');
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  return ok(res, user, 'Profile updated');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  return ok(res, null, 'Password changed successfully');
});

module.exports = { register, login, me, updateProfile, changePassword };
