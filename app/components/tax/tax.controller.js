const TaxService = require('../../services/taxService');
const { createResponse, createError } = require('./../../utils/helpers');

class ProjectController {
  async create(req, res) {
    try {
      const result = await TaxService.create();
      if (result) return createResponse(res, 'ok', 'Taxes created successfully', result);
      else return createError(res, { message: 'Unable to create taxes' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async get(req, res) {
    try {
      const items = await TaxService.get();
      return createResponse(res, 'ok', 'Tax List', items);
    } catch (e) {
      return createError(res, e);
    }
  }

  async getSingle(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const item = await TaxService.getSingle(user.id, id);
      if (item) return createResponse(res, 'ok', 'Tax', item);
      else return createError(res, { message: 'Tax not found' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new ProjectController();
module.exports = controller;
