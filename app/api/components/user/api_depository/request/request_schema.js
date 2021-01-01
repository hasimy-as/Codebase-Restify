/**
 * @description 
 * In Development
 */

const joi = require('joi');

const createUser = joi.object({
	name: joi.string().required(),
	address: joi.string().required(),
});

const updateUser = joi.object({
	userId: joi.string().guid().required(),
	name: joi.string().required(),
	address: joi.string().required(),
});

const deleteUser = joi.object({
	userId: joi.string().guid().required(),
});

module.exports = {
	createUser,
	updateUser,
	deleteUser,
};
