const express = require('express');
const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const controller = require('./project.controller');

/**
 * @route POST api/project/
 * @description create
 * @returns JSON
 * @access public
 */
router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  //   validations.getSingle,
  (req, res) => {
    controller.create(req, res);
  },
);

/**
 * @route GET api/project/:id
 * @description get single
 * @returns JSON
 * @access public
 */
router.get(
  '/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.getSingle(req, res);
  },
);

/**
 * @route GET api/project/:id
 * @description get list
 * @returns JSON
 * @access public
 */
router.get(
  '/',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.get(req, res);
  },
);

/**
 * @route DELETE api/project/:id
 * @description get list
 * @returns JSON
 * @access public
 */
router.delete(
  '/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.delete(req, res);
  },
);

/**
 * @route POST api/project/make-payment/:id
 * @description create
 * @returns JSON
 * @access public
 */
router.post(
  '/make-payment/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  //   validations.getSingle,
  (req, res) => {
    controller.payment(req, res);
  },
);

router.put(
  '/update-status/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    controller.updateStatus(req, res);
  },
);

module.exports = router;
