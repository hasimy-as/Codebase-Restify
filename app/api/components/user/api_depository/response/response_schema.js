const joi = require('joi');

const getOneUserSchema = joi.object({
	userId: joi.string().guid().required(),
});

module.exports = {
	getOneUserSchema,
};
