const express = require('express');
// Init Router
const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const PaymentController = require('./payment.controller');

router.post(
  '/create-order/:id',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    PaymentController.create(req, res);
  },
);
module.exports = router;
