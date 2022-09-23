const service = require('../../services/notificationsService');
const { createResponse, createError } = require('./../../utils/helpers');

class NotificationsController {
  async get(req, res) {
    try {
      const { user } = req;

      const result = await service.get(user.id);
      if (result) return createResponse(res, 'ok', 'Notifications Listed successfully', result);
      else return createError(res, {}, { message: 'Unable to get notifications' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async getSingle(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;

      const result = await service.getSingle(user.id, id);
      if (result) return createResponse(res, 'ok', 'Notification details', result);
      else return createError(res, {}, { message: 'Unable to get notification' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new NotificationsController();
module.exports = controller;
