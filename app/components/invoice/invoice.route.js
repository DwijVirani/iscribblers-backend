const express = require('express');
// Init Router
const router = express.Router();
const passport = require('passport');
const PassportErrorHandler = require('../../middleware/passportErrorResponse');
const invoiceController = require('./invoice.controller');

router.get(
  '/',
  [
    passport.authenticate('jwt', { session: false, failWithError: true }),
    PassportErrorHandler.success,
    PassportErrorHandler.error,
  ],
  (req, res) => {
    invoiceController.get(req, res);
  },
);

router.get(
  '/pdf-preview/:id',
  // [
  //   passport.authenticate('jwt', { session: false, failWithError: true }),
  //   PassportErrorHandler.success,
  //   PassportErrorHandler.error,
  //   userCompanyAuth,
  // ],
  // validations.getItem,
  (req, res) => {
    invoiceController.getPDFPreview(req, res);
  },
);
module.exports = router;
