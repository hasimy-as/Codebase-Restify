const logger = require('../../../../../helpers/logger');
const wrapper = require('../../../../../helpers/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const Query = require('./query');

class Admin {
  constructor(db) {
    this.qProcess = new Query(db);
  }

  async getAdmins() {
    const ctx = 'Admin-getAdmins';
    const { data: admin, err: adminErr } = await this.qProcess.findMany();
    if (adminErr) {
      logger.error(ctx, 'Cannot get all admins.', adminErr);
      return wrapper.error('error', 'Cannot get all admins!', CODE.INTERNAL_ERROR);
    }
    return wrapper.data(admin, '', CODE.SUCCESS);
  }

  async getAdminById(payload) {
    const ctx = 'Admin-getAdminById';
    const { data: admin, err: adminErr } = await this.qProcess.findOne({ adminId: payload.adminId });
    if (adminErr) {
      logger.error(ctx, 'Admin not found', adminErr);
      return wrapper.error('error', 'Admin not found!', CODE.NOT_FOUND);
    }
    return wrapper.data(admin, '', CODE.SUCCESS);
  }
}

module.exports = Admin;
