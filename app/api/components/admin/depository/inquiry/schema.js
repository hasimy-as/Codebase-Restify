const joi = require('joi');

const getAdminById = joi.object({
  adminId: joi.string().guid().required(),
});

module.exports = {
  getAdminById,
};
