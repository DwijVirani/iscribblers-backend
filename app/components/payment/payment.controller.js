const paymentService = require('../../services/paymentService');
const { createResponse, createError } = require('./../../utils/helpers');

class PaymentController {
  async create(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const result = await paymentService.create(user.id, id);
      if (result) createResponse(res, 'ok', 'Order created successfully', result);
      else createError(res, {}, { message: 'Order creation failed' });
    } catch (e) {
      createError(res, e);
    }
  }
}

const controller = new PaymentController();
module.exports = controller;
