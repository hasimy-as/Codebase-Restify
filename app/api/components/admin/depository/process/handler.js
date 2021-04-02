const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const Admin = require('./main');
const admin = new Admin(db);

const createAdmin = async (payload) => {
  return admin.createAdmin(payload);
};

const loginAdmin = async (payload) => {
  return admin.loginAdmin(payload);
};

const updateAdmin = async (payload) => {
  return admin.updateAdmin(payload);
};

const deleteAdmin = async (payload) => {
  return admin.deleteAdmin(payload);
};

module.exports = {
  loginAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
