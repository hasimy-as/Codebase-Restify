const joi = require('joi');

const createUser = joi.object({
	name: joi.string().required(),
	address: joi.string().required(),
});

module.exports = {
	createUser,
};
