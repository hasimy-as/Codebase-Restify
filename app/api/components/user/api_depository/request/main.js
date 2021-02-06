const uuid = require('uuid');

const crypt = require('../../../../../lib/crypt');
const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const jwtAuth = require('../../../../auth/jwt_auth');

const request = require('./request');
const response = require('../response/response');

class User {
  async createUser(payload) {
    const findUsername = await response.findOne({ username: payload.username });
    if (findUsername.code === CODE.SUCCESS) {
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
      return wrapper.error(
        'fail',
        'Failed to create user',
        CODE.INTERNAL_ERROR,
      );
    }

    const { data } = user;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async loginUser(payload) {
    const { data: user, err: userErr } = await response.findOne({ username: payload.username });
    if (userErr) {
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
