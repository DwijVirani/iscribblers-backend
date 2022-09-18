const mongoose = require('mongoose');
const { USER_ROLE_TYPES } = require('../config/constants');
const Project = require('./../models/project');
const userService = require('./userService');

class DashboardService {
  async widgets(userId) {
    try {
      console.log('user', userId);
      const user = await userService.get(userId);
      let query = {
        $or: [
          { createdBy: mongoose.Types.ObjectId('62deb4543ed020ac8e7862dc') },
          { assigned_to: mongoose.Types.ObjectId(userId) },
        ],
      };

      if (user.role === USER_ROLE_TYPES.ADMIN) query = {};
      const projectCounts = await Project.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: '$_id',
            count: '$count',
            _id: 0,
          },
        },
      ]);

      console.log('project', projectCounts);
      return projectCounts;
    } catch (e) {
      throw e;
    }
  }
}

const service = new DashboardService();
module.exports = service;
