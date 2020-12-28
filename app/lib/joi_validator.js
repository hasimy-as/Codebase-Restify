const joi = require('@hapi/joi');
const wrapper = require('./wrapper');
const { CODE } = require('./http_code');

const validatePayload = async (payload, constraint) => {
	const { value, error } = joi.validate(payload, constraint);
	if (error) {
		const message = error.details.shift().message.replace(/"/g, '');
		return wrapper.error(true, message, CODE.BAD_REQUEST);
	}
	return wrapper.data(value, 'success', 200);
};

module.exports = {
	validatePayload,
};
