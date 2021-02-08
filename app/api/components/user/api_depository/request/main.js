const uuid = require('uuid');

const crypt = require('../../../../../lib/crypt');
const logger = require('../../../../../lib/logger');
const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const jwtAuth = require('../../../../auth/jwt_auth');

const request = require('./request');
const response = require('../response/response');

class User {
  async createUser(payload) {
    const ctx = 'User-createUser';
    const findUsername = await response.findOne({ username: payload.username });
    if (findUsername.code === CODE.SUCCESS) {
      logger.log(ctx, 'Username has been used.', 'Error');
      return wrapper.error('error', 'Username has been used', CODE.BAD_REQUEST);
    }
    const password = await crypt.encrypt(payload.password);

    let userData = {
      userId: uuid(),
      ...payload,
      password: password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const user = await request.insertOne(userData);
    if (user.err) {
      logger.log(ctx, 'Failed to create user.', user.err);
      return wrapper.error('fail', 'Failed to create user', CODE.INTERNAL_ERROR);
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async loginUser(payload) {
    const ctx = 'User-loginUser';
    const { data: user, err: userErr } = await response.findOne({ username: payload.username });
    if (userErr) {
      logger.log(ctx, 'User not found.', userErr);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    let userData = {};
    const { password } = user;
    const userPassword = await crypt.decrypt(password);

    if (payload.password === userPassword) {
      userData = {
        userId: user.userId,
        username: user.username,
        name: user.name,
        expiresIn: 864000
      };
    } else {
      logger.log(ctx, 'Password incorrect.', 'Error');
      return wrapper.error('error', 'Password incorrect!', CODE.BAD_REQUEST);
    }

    const token = await jwtAuth.generateToken(userData);

    const result = {
      ...userData,
      accessToken: token
    };

    return wrapper.data(result, 'Logged in', CODE.SUCCESS);
  }

  async updateUser(payload) {
    const ctx = 'User-updateUser';
    const findUserId = await response.findOne({ userId: payload.userId });
    if (findUserId.err) {
      logger.log(ctx, 'User not found.', findUserId.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const user = await request.updateOne(
      { userId: payload.userId },
      { $set: { ...payload } },
    );
    if (user.err) {
      logger.log(ctx, 'Failed to update user.', user.err);
      return wrapper.error('fail', 'Failed to update user', CODE.INTERNAL_ERROR);
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async deleteUser(payload) {
    const ctx = 'User-deleteUser';
    const findUserId = await response.findOne({ userId: payload.userId });
    if (findUserId.err) {
      logger.log(ctx, 'User not found', findUserId.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const user = await request.deleteOne({ userId: payload.userId });
    if (user.err) {
      logger.log(ctx, 'Failed to delete user.', user.err);
      return wrapper.error('fail', 'Failed to delete user', CODE.INTERNAL_ERROR);
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = User;
