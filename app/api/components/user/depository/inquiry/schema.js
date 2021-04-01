const joi = require('joi');

const getUserByIdSchema = joi.object({
  userId: joi.string().guid().required(),
});

module.exports = {
  getUserByIdSchema,
};
