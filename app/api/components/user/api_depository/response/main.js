const logger = require('../../../../../lib/logger');
const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const response = require('./response');

class User {
  async getUsers() {
    const ctx = 'User-getUsers';
    const user = await response.findMany();
    if (user.err) {
      logger.log(ctx, 'Application error.', user.err);
      return wrapper.error('error', 'Application error', CODE.INTERNAL_ERROR);
    }
    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async getOneUser(payload) {
    const ctx = 'User-getOneUser';
    const user = await response.findOne({ userId: payload.userId });
    if (user.err) {
      logger.log(ctx, 'User not found', user.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }
    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = User;
