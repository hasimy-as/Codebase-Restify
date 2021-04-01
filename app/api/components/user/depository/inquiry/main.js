const logger = require('../../../../../helpers/logger');
const wrapper = require('../../../../../helpers/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const Query = require('./query');

class User {
  constructor(db) {
    this.qProcess = new Query(db);
  }

  async getUsers() {
    const ctx = 'User-getUsers';
    const user = await this.qProcess.findMany();
    if (user.err) {
      logger.error(ctx, 'Cannot get all users.', user.err);
      return wrapper.error('error', 'Cannot get all users!', CODE.INTERNAL_ERROR);
    }
    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async getUserById(payload) {
    const ctx = 'User-getUserById';
    const user = await this.qProcess.findOne({ userId: payload.userId });
    if (user.err) {
      logger.error(ctx, 'User not found', user.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }
    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = User;
