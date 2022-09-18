const service = require('./../../services/dashboardService');
const { createResponse, createError } = require('./../../utils/helpers');

class DashboardController {
  async widgets(req, res) {
    try {
      const { user } = req;
      const item = await service.widgets(user.id);
      if (item) return createResponse(res, 'ok', 'Dashboard Widget Details', item);
      else return createError(res, { message: 'Unable to get dashboard details' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new DashboardController();
module.exports = controller;
