const joi = require('joi');
const { ROLES } = require('../../../../../lib/fields');

const createAdmin = joi.object({
  roles: joi.string().default(ROLES.SUPER_ADMIN).optional(),
  name: joi.string().required(),
  address: joi.string().required(),
  email: joi.string().email().max(50).required(),
  password: joi.string().min(6).required(),
});

const loginAdmin = joi.object({
  email: joi.string().email().max(50).required(),
  password: joi.string().min(6).required(),
});

const updateAdmin = joi.object({
  adminId: joi.string().guid().required(),
  name: joi.string().required(),
  address: joi.string().required(),
  email: joi.string().email().max(50).required(),
  password: joi.string().min(6).required(),
});

const deleteAdmin = joi.object({
  adminId: joi.string().guid().required(),
});

module.exports = {
  loginAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
