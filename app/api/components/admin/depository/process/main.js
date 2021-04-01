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

class Admin {
  constructor(db) {
    this.client = new Redis();
    this.process = new Command(db);
    this.qProcess = new Query(db);
  }

  async createAdmin(payload) {
    const ctx = 'Admin-createAdmin';
    const findEmail = await this.qProcess.findOne({ email: payload.email });
    if (findEmail.code === CODE.SUCCESS) {
      logger.error(ctx, 'Email has been used.', 'Error');
      return wrapper.error('error', 'Email has been used!', CODE.BAD_REQUEST);
    }

    const password = await crypt.encrypt(payload.password);
    const { data: admin, err: adminErr } = await this.process.insertOne({
      adminId: uuid(),
      ...payload,
      password: password,
      createdAt: new Date().toISOString()
    });

    if (adminErr) {
      logger.error(ctx, 'Failed to create admin.', adminErr);
      return wrapper.error('fail', 'Failed to create admin!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(admin, '', CODE.SUCCESS);
  }

  async loginAdmin(payload) {
    const ctx = 'Admin-loginAdmin';
    const { data: admin, err: adminErr } = await this.qProcess.findOne({ email: payload.email });
    if (adminErr) {
      logger.error(ctx, 'Admin not found.', adminErr);
      return wrapper.error('error', 'Admin not found!', CODE.NOT_FOUND);
    }

    if (admin.roles === ROLES.SUPER_ADMIN) {
      let adminData = {};
      const { password, ...payloadVal } = admin;
      const adminPassword = await crypt.decrypt(password);

      if (payload.password === adminPassword) {
        adminData = {
          adminId: payloadVal.adminId,
          name: payloadVal.name,
          email: payloadVal.adminId,
          address: payloadVal.address,
          roles: payloadVal.roles,
          expiresIn: 864000,
          key: REDIS_KEY.SUPER_ADMIN
        };
      } else {
        logger.error(ctx, 'Password incorrect.', 'Error');
        return wrapper.error('error', 'Password incorrect!', CODE.BAD_REQUEST);
      }

      const token = await jwtAuth.generateToken(adminData);
      const redis = await this.client.setExpire(`${adminData.key}${adminData._id}`, adminData, 'EX', adminData.expiresIn);
      if (token.err || redis.err) {
        return wrapper.error('fail', 'Login failed!', CODE.INTERNAL_ERROR);
      }

      const result = {
        ...adminData,
        accessToken: token
      };

      return wrapper.data(result, 'Logged in.', CODE.SUCCESS);
    }
    return wrapper.error('fail', 'Account is not an admin!', CODE.UNAUTHORIZED);
  }

  async updateAdmin(payload) {
    const ctx = 'Admin-updateAdmin';
    const { opts, ...payloadVal } = payload;
    if (opts.roles !== ROLES.SUPER_ADMIN) {
      logger.error(ctx, 'This account is not an admin.', 'Error');
      return wrapper.error('fail', 'This account is not an admin!', CODE.UNAUTHORIZED);
    }

    const findAdmin = await this.qProcess.findOne({ adminId: payload.adminId });
    if (findAdmin.err) {
      logger.error(ctx, 'Admin not found.', findAdmin.err);
      return wrapper.error('error', 'Admin not found!', CODE.NOT_FOUND);
    }

    const password = await crypt.encrypt(payloadVal.password);
    const { data: admin, err: adminErr } = await this.process.updateOne(
      { adminId: payload.adminId },
      {
        $set: {
          ...payloadVal,
          password: password,
          updatedAt: new Date().toISOString()
        }
      },
    );
    if (adminErr) {
      logger.error(ctx, 'Failed to update admin.', adminErr);
      return wrapper.error('fail', 'Failed to update admin!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(admin, '', CODE.SUCCESS);
  }

  async deleteAdmin(payload) {
    const ctx = 'Admin-deleteAdmin';
    const { opts } = payload;
    if (opts.roles !== ROLES.SUPER_ADMIN) {
      logger.error(ctx, 'This account is not an admin.', 'Error');
      return wrapper.error('fail', 'This account is not an admin!', CODE.UNAUTHORIZED);
    }

    const findAdmin = await this.qProcess.findOne({ adminId: payload.adminId });
    if (findAdmin.err) {
      logger.error(ctx, 'Admin not found', findAdmin.err);
      return wrapper.error('error', 'Admin not found!', CODE.NOT_FOUND);
    }

    const { data: admin, err: adminErr} = await this.process.deleteOne({ adminId: payload.adminId });
    if (adminErr) {
      logger.error(ctx, 'Failed to delete admin.', adminErr);
      return wrapper.error('fail', 'Failed to delete admin!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(admin, '', CODE.SUCCESS);
  }
}

module.exports = Admin;
