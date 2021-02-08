const joi = require('joi');

const createUser = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  username: joi.string().regex(/^[a-z0-9_.]{5,13}$/).required(),
  password: joi.string().min(6).required(),
});

const loginUser = joi.object({
  username: joi.string().regex(/^[a-z0-9_.]{5,13}$/).required(),
  password: joi.string().min(6).required(),
});

const updateUser = joi.object({
  userId: joi.string().guid().required(),
  name: joi.string().required(),
  address: joi.string().required(),
  username: joi.string().regex(/^[a-z0-9_.]{5,13}$/).required(),
  password: joi.string().min(6).required(),
});

const deleteUser = joi.object({
  userId: joi.string().guid().required(),
});

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
};
