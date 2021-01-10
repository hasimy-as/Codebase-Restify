const User = require('./main');

const getUsers = async () => {
  const user = new User();
  return user.getUsers();
};

const getOneUser = async (payload) => {
  const user = new User();
  return user.getOneUser(payload);
};

module.exports = {
  getUsers,
  getOneUser,
};
