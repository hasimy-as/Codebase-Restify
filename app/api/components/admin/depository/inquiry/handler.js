const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const Admin = require('./main');
const admin = new Admin(db);

const getAdmins = async () => {
  return admin.getAdmins();
};

const getAdminById = async (payload) => {
  return admin.getAdminById(payload);
};

module.exports = {
  getAdmins,
  getAdminById,
};
