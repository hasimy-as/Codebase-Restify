const uuid = require('uuid');

const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const request = require('./request');
const response = require('../response/response');

class User {
  async createUser(payload) {
    let userData = {
      userId: uuid(),
      ...payload,
    };

    const user = await request.insertOne(userData);
    if (user.err) {
      return wrapper.error(
        'fail',
        'Failed to create user',
        CODE.INTERNAL_ERROR,
      );
    }
    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async updateUser(payload) {
    const findUserId = await response.findOne({ userId: payload.userId });
    if (findUserId.err) {
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const user = await request.updateOne(
      { userId: payload.userId },
      { $set: { ...payload } },
    );
    if (user.err) {
      return wrapper.error(
        'fail',
        'Failed to update user',
        CODE.INTERNAL_ERROR,
      );
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async deleteUser(payload) {
    const findUserId = await response.findOne({ userId: payload.userId });
    if (findUserId.err) {
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const user = await request.deleteOne({ userId: payload.userId });
    if (user.err) {
      return wrapper.error(
        'fail',
        'Failed to delete user',
        CODE.INTERNAL_ERROR,
      );
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = User;
