const ProjectService = require('../../services/projectService');
const { createResponse, createError } = require('./../../utils/helpers');

class ProjectController {
  async create(req, res) {
    try {
      const { user } = req;
      const payload = { ...req.body };
      const result = await ProjectService.create(user.id, payload);
      if (result) return createResponse(res, 'ok', 'Project created successfully', result);
      else return createError(res, { message: 'Unable to create project' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async get(req, res) {
    try {
      const { user } = req;
      const items = await ProjectService.get(user.id);
      return createResponse(res, 'ok', 'Project List', items);
    } catch (e) {
      return createError(res, e);
    }
  }

  async getSingle(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const item = await ProjectService.getSingle(user.id, id);
      if (item) return createResponse(res, 'ok', 'Project', item);
      else return createError(res, { message: 'Project not found' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async delete(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const item = await ProjectService.delete(user.id, id);
      return createResponse(res, 'ok', 'Project deleted', item);
    } catch (e) {
      return createError(res, e);
    }
  }

  async payment(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const result = await ProjectService.payment(user.id, id);
      if (result) return createResponse(res, 'ok', 'Project payment successful', result);
    } catch (e) {
      return createError(res, e);
    }
  }

  async updateStatus(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const payload = req.body.status;
      const item = await ProjectService.updateStatus(user.id, id, payload);
      if (item) return createResponse(res, 'ok', 'Project status updated successfully', item);
      else return createError(res, { message: 'Unable to update status' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async assignProjectToCreator(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;
      const { creator } = req.body;

      const item = await ProjectService.assignProjectToCreator(user.id, id, creator);
      if (item) return createResponse(res, 'ok', 'Project assigned successfully', item);
      else return createError(res, { message: 'Unable to assign project' });
    } catch (e) {
      return createError(res, e);
    }
  }

  async acceptProject(req, res) {
    try {
      const { user } = req;
      const { id } = req.params;

      const item = await ProjectService.acceptProject(user.id, id);
      if (item) return createResponse(res, 'ok', 'Project accepted successfully', item);
      else return createError(res, { message: 'Unable to accept project' });
    } catch (e) {
      return createError(res, e);
    }
  }
}

const controller = new ProjectController();
module.exports = controller;
