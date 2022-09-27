const express = require('express');

const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const controller = require('./dashboard.controller');

/**
 * @route GET api/project/dashboard
 * @description get widgets
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

/**
 * @route GET api/project/creator-list
 * @description get creator list
 * @returns JSON
 * @access public
 */
router.get(
  '/creator-list',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.getCreatorList(req, res);
  },
);

/**
 * @route PUT api/project/accept-creator
 * @description accept creator
 * @returns JSON
 * @access public
 */
router.put(
  '/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.acceptCreator(req, res);
  },
);

/**
 * @route PUT api/project/reject-creator
 * @description reject creator
 * @returns JSON
 * @access public
 */
router.put(
  '/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.rejectCreator(req, res);
  },
);

module.exports = router;
