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

  async getCreatorList(req, res) {
    try {
      const { user } = req;
      const result = await service.getCreatorList(user.id);
      if (result) return createResponse(res, 'ok', 'Creator list', result);
      else return createError(res, { message: 'Unable to get creator list' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async acceptCreator(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const result = await service.acceptCreator(user.id, id);
      if (result) return createResponse(res, 'ok', 'Creator accepted successfully', result);
      else return createError(res, { message: 'Unable to accept creator' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async rejectCreator(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const result = await service.rejectCreator(user.id, id);
      if (result) return createResponse(res, 'ok', 'Creator rejected successfully', result);
      else return createError(res, { message: 'Unable to reject creator' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new DashboardController();
module.exports = controller;
