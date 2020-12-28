const payloadValidation = require('../../../../lib/joi_validator');
const { sendResponse } = require('../../../../lib/responses');

const requestSchema = require('../api_depository/request/request_schema');
const requestManage = require('../api_depository/request/request_management');

const createUser = async (req, res) => {
	let { body } = req;
	const validate = await payloadValidation.validatePayload(
		body,
		requestSchema.createUser,
	);
	if (validate.err) {
		return sendResponse(validate, res);
	}
	const { data } = validate;
	const result = await requestManage.createUser({ ...data });
	return sendResponse(result, res);
};

module.exports = {
	createUser,
};
