const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const User = require('./main');
const user = new User(db);

const getUsers = async () => {
  return user.getUsers();
};

const getUserById = async (payload) => {
  return user.getUserById(payload);
};

module.exports = {
  getUsers,
  getUserById,
};
