const express = require('express');

const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const controller = require('./dashboard.controller');

/**
 * @route PUT api/project/dashboard
 * @description create
 * @returns JSON
 * @access public
 */
router.get(
  '/count',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.widgets(req, res);
  },
);

module.exports = router;
