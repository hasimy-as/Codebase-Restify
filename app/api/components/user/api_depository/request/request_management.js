const User = require('./main');

const createUser = async (payload) => {
  const user = new User();
  return user.createUser(payload);
};

const loginUser = async (payload) => {
  const user = new User();
  return user.loginUser(payload);
};

const updateUser = async (payload) => {
  const user = new User();
  return user.updateUser(payload);
};

const deleteUser = async (payload) => {
  const user = new User();
  return user.deleteUser(payload);
};

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
};
