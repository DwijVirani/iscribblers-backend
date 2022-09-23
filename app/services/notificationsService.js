const Notification = require('../models/notifications');
const RepositoryService = require('./repositoryService');
const userService = require('./userService');

class NotificationsService extends RepositoryService {
  constructor() {
    super(Notification);
  }

  async create(payload) {
    try {
      if (!payload.user || !payload.message) return;

      const user = await userService.getSingle(payload.user);
      if (!user) throw Error('User does not exists');

      const result = await super.create(user.id, payload);
      if (result) {
        const item = await this.getSingle(result.id);
        return item;
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getSingle(userId, id) {
    try {
      if (!id) return;

      const item = await Notification.findOne({ _id: id }).populate([{ path: 'user' }]);
      if (item) return item.toJSON();
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async get(id) {
    try {
      if (!id) return;

      const result = await Notification.find({ user: id }).populate([{ path: 'user' }]);
      if (result) {
        return result.map((x) => {
          return x.toJSON();
        });
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getByProjectId(id) {
    try {
      if (!id) return;

      const item = await Notification.findOne({ project: id });
      if (item) return item;
      return undefined;
    } catch (e) {
      throw e;
    }
  }
}

const service = new NotificationsService();
module.exports = service;
