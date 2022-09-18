const mongoose = require('mongoose');
const { USER_TYPE, PROJECT_STATUS } = require('../config/constants');
const Project = require('./../models/project');
const userService = require('./userService');

class DashboardService {
  async widgets(userId) {
    try {
      const user = await userService.getUser(userId);

      let query = {
        $or: [{ createdBy: mongoose.Types.ObjectId(userId) }, { assigned_to: mongoose.Types.ObjectId(userId) }],
      };

      if (user.role === USER_TYPE.ADMIN) query = {};
      const projectCounts = await Project.aggregate([
        { $match: { ...query } },
        {
          $group: {
            _id: { status: '$status', accepted: '$is_accepted_by_creator' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: '$_id.status',
            accepted: '$_id.accepted',
            count: '$count',
            _id: 0,
          },
        },
      ]);
      const allProjects = await Project.find({});
      const totalRevenue = allProjects.reduce((sum, x) => sum + x.amount, 0);

      let result = [];
      if (user.role === USER_TYPE.BUSINESS) {
        const filteredResult = projectCounts.filter((x) => x.status !== PROJECT_STATUS.REVIEW_NEEDED);
        result = { items: filteredResult, totalCount: filteredResult.reduce((sum, x) => sum + x.count, 0) };
      } else if (user.role === USER_TYPE.CREATOR) {
        const newAssignments = projectCounts.filter((x) => x.status !== PROJECT_STATUS.COMPLETE && !x.accepted);
        const incomplete = projectCounts.filter((x) => x.status !== PROJECT_STATUS.COMPLETE);
        const rework = projectCounts.filter((x) => x.status !== PROJECT_STATUS.REWORK_NEEDED);
        return {
          items: [
            {
              status: PROJECT_STATUS.NEW,
              count: newAssignments.reduce((sum, x) => sum + x.count, 0),
            },
            {
              status: PROJECT_STATUS.INCOMPLETE,
              count: incomplete.reduce((sum, x) => sum + x.count, 0),
            },
            {
              status: PROJECT_STATUS.REWORK_NEEDED,
              count: rework.reduce((sum, x) => sum + x.count, 0),
            },
          ],
          totalCount: projectCounts.reduce((sum, x) => sum + x.count, 0),
        };
      } else if (user.role === USER_TYPE.ADMIN) {
        const completed = projectCounts.filter((x) => x.status === PROJECT_STATUS.COMPLETE);
        const incomplete = projectCounts.filter((x) => x.status !== PROJECT_STATUS.COMPLETE);
        return {
          items: [
            {
              status: PROJECT_STATUS.COMPLETE,
              count: completed.reduce((sum, x) => sum + x.count, 0),
            },
            {
              status: PROJECT_STATUS.INCOMPLETE,
              count: incomplete.reduce((sum, x) => sum + x.count, 0),
            },
          ],
          totalCount: projectCounts.reduce((sum, x) => sum + x.count, 0),
          totalRevenue,
        };
      }
      return result;
    } catch (e) {
      throw e;
    }
  }
}

const service = new DashboardService();
module.exports = service;
