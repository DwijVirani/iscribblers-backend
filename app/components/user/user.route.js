const express = require('express');
// Init Router
const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const UserController = require('./user.controller');
const UserValidations = require('./user.validations');

/**
 * @route POST api/user/me
 * @description get my profile
 * @returns JSON
 * @access public
 */
router.get(
  '/me',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    UserController.getMyProfile(req, res);
  },
);

/**
 * @route POST api/user/profile
 * @description update my profile
 * @returns JSON
 * @access public
 */
router.post(
  '/profile',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  UserValidations.updateProfile,
  (req, res) => {
    UserController.updateUser(req, res);
  },
);

/**
 * @route POST api/user/update-password
 * @description change password
 * @returns JSON
 * @access public
 */
router.post(
  '/update-password',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  UserValidations.updatePassword,
  (req, res) => {
    UserController.updatePassword(req, res);
  },
);

router.get(
  '/details',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    UserController.getUserDetails(req, res);
  },
);

router.put(
  '/add-number',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    UserController.addUserPhoneAndRole(req, res);
  },
);

module.exports = router;
