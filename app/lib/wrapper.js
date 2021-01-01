/**
 * @description 
 * In Development
 */

const { CODE } = require('./http_code');

const data = (data, description = '', code = CODE.SUCCESS) => ({
	err: null,
	message: description,
	data,
	code,
});

const error = (err, description, code = CODE.INTERNAL_ERROR) => ({
	err,
	code,
	data: '',
	message: description,
});

const response = (res, type, result, message, code) => {
	if (message) {
		result.message = message;
	}
	if (code) {
		result.code = code;
	}
	let status;
	switch (type) {
		case 'fail':
			status = false;
			break;
		case 'success':
			status = true;
			break;
		default:
			status = true;
			break;
	}
	res.send(result.code, {
		success: status,
		data: result.data,
		message: result.message,
		code: result.code,
	});
};

module.exports = {
	data,
	error,
	response,
};