class RepositoryService {
  constructor(collection) {
    this.collection = collection;
  }

  async get() {
    try {
      const result = await this.collection.find({});
      if (result) {
        return result.map((item) => item.toJSON());
      }
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getRaw() {
    try {
      const result = await this.collection.find({});
      if (result) return result;
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async getSingle(id) {
    try {
      if (!id) return;

      const result = await this.collection.findOne({ _id: id });
      if (result) return result.toJSON();
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async create(userId, payload) {
    try {
      if (!payload) return;
      const itemPayload = {
        ...payload,
        createdBy: userId,
      };

      const result = await this.collection.create(itemPayload);
      if (result) return result.toJSON();
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  async update(userId, id, payload) {
    try {
      if (!id) throw new Error('Id is required');
      if (!payload) throw new Error('Data is required');

      delete payload.createdBy;
      delete payload.createdAt;

      const itemPayload = {
        ...payload,
        id,
        updatedBy: userId,
      };

      const result = await this.collection.findOneAndUpdate({ _id: id }, itemPayload, { new: false });
      if (result) return result.toJSON();
      return undefined;
    } catch (e) {
      throw e;
    }
  }

  // /**
  //  * @description delete
  //  */
  // async archive(id) {
  //   try {
  //     const query = { _id: id };
  //     const result = await this.collection.delete(query);
  //     if (result && result.ok > 0) {
  //       return true;
  //     }
  //     throw Error('Unable to archived item');
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  /**
   * @description delete
   */
  async delete(id) {
    try {
      const query = {
        _id: id,
      };
      const result = await this.collection.delete(query);
      if (result) {
        return true;
      }
      throw Error('Unable to delete item');
    } catch (e) {
      throw e;
    }
  }

  async getByIds(ids = []) {
    try {
      const query = {
        $in: ids,
      };
      const result = await this.collection.find(query);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async count() {
    try {
      const result = await this.collection.count({});
      if (result) return result;
      return 0;
    } catch (e) {
      throw e;
    }
  }
}
module.exports = RepositoryService;
