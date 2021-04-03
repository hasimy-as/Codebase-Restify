const uuid = require('uuid');

const { ROLES, REDIS_KEY } = require('../../../../../lib/fields');
const { CODE } = require('../../../../../lib/http_code');

const jwtAuth = require('../../../../auth/jwt_auth');
const crypt = require('../../../../../helpers/crypt');
const logger = require('../../../../../helpers/logger');
const wrapper = require('../../../../../helpers/wrapper');

const Command = require('./command');
const Query = require('../inquiry/query');
const Redis = require('../../../../../database/redis/commands');

class User {
  constructor(db) {
    this.client = new Redis();
    this.process = new Command(db);
    this.qProcess = new Query(db);
  }

  async createUser(payload) {
    const ctx = 'User-createUser';
    const { opts, ...payloadVal } = payload;
    if (opts.roles !== ROLES.SUPER_ADMIN) {
      logger.error(ctx, 'This account is not an admin.', 'Error');
      return wrapper.error('fail', 'This account is not an admin!', CODE.UNAUTHORIZED);
    }

    const findEmail = await this.qProcess.findOne({ email: payload.email });
    if (findEmail.code === CODE.SUCCESS) {
      logger.error(ctx, 'Email has been used.', 'Error');
      return wrapper.error('error', 'Email has been used!', CODE.BAD_REQUEST);
    }

    const password = await crypt.encrypt(payload.password);
    const { data: user, err: userErr } = await this.process.insertOne({
      userId: uuid(),
      ...payloadVal,
      password: password,
      createdAt: new Date().toISOString()
    });

    if (userErr) {
      logger.error(ctx, 'Failed to create user.', userErr);
      return wrapper.error('fail', 'Failed to create user!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(user, '', CODE.SUCCESS);
  }

  async loginUser(payload) {
    const ctx = 'User-loginUser';
    const { data: user, err: userErr } = await this.qProcess.findOne({ email: payload.email });
    if (userErr) {
      logger.error(ctx, 'User not found.', userErr);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    if (user.roles === ROLES.USER) {
      let userData = {};
      const { password, ...payloadVal } = user;
      const userPassword = await crypt.decrypt(password);

      if (payload.password === userPassword) {
        userData = {
          userId: payloadVal.userId,
          name: payloadVal.name,
          email: payloadVal.email,
          address: payloadVal.address,
          roles: payloadVal.roles,
          expiresIn: 864000,
          key: REDIS_KEY.USER
        };
      } else {
        logger.error(ctx, 'Password incorrect.', 'Error');
        return wrapper.error('error', 'Password incorrect!', CODE.BAD_REQUEST);
      }

      const token = await jwtAuth.generateToken(userData);
      const redis = await this.client.setExpire(`${userData.key}${userData._id}`, userData, 'EX', userData.expiresIn);
      if (token.err || redis.err) {
        return wrapper.error('fail', 'Login failed!', CODE.INTERNAL_ERROR);
      }

      const result = {
        ...userData,
        accessToken: token
      };

      return wrapper.data(result, 'Logged in', CODE.SUCCESS);
    }
    return wrapper.error('fail', 'Account is not a user!', CODE.UNAUTHORIZED);
  }

  async updateUser(payload) {
    const ctx = 'User-updateUser';
    const { opts, ...payloadVal } = payload;
    if (opts.roles !== ROLES.USER) {
      logger.error(ctx, 'This account is not a user.', 'Error');
      return wrapper.error('fail', 'This account is not a user!', CODE.UNAUTHORIZED);
    }

    const findUser = await this.qProcess.findOne({ userId: payload.userId });
    if (findUser.err) {
      logger.error(ctx, 'User not found.', findUser.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const password = await crypt.encrypt(payloadVal.password);
    const { data: user, err: userErr } = await this.process.updateOne(
      { userId: payload.userId },
      {
        $set: {
          ...payloadVal,
          password: password,
          updatedAt: new Date().toISOString()
        }
      },
    );
    if (userErr) {
      logger.error(ctx, 'Failed to update user.', userErr);
      return wrapper.error('fail', 'Failed to update user!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(user, '', CODE.SUCCESS);
  }

  async deleteUser(payload) {
    const ctx = 'User-deleteUser';
    const { opts } = payload;
    if (opts.roles !== ROLES.SUPER_ADMIN) {
      logger.error(ctx, 'This account is not an admin.', 'Error');
      return wrapper.error('fail', 'This account is not an admin!', CODE.UNAUTHORIZED);
    }

    const findUser = await this.qProcess.findOne({ userId: payload.userId });
    if (findUser.err) {
      logger.error(ctx, 'User not found', findUser.err);
      return wrapper.error('error', 'User not found!', CODE.NOT_FOUND);
    }

    const { data: user, err: userErr} = await this.process.deleteOne({ userId: payload.userId });
    if (userErr) {
      logger.error(ctx, 'Failed to delete user.', userErr);
      return wrapper.error('fail', 'Failed to delete user!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(user, '', CODE.SUCCESS);
  }
}

module.exports = User;
