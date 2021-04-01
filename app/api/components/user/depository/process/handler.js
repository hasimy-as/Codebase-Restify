const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const User = require('./main');
const user = new User(db);

const createUser = async (payload) => {
  return user.createUser(payload);
};

const loginUser = async (payload) => {
  return user.loginUser(payload);
};

const updateUser = async (payload) => {
  return user.updateUser(payload);
};

const deleteUser = async (payload) => {
  return user.deleteUser(payload);
};

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
};
