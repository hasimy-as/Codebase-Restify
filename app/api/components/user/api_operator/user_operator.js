require('joi');

const { sendResponse } = require('../../../../lib/responses');
const requestSchema = require('../api_depository/request/request_schema');
const requestManage = require('../api_depository/request/request_management');

const createUser = async (req, res) => {
	let { body } = req;
	const data = await requestSchema.createUser.validateAsync(body);
	if (data.err) {
		return sendResponse(data, res);
	}
	const result = await requestManage.createUser(data);
	return sendResponse(result, res);
};

module.exports = {
	createUser,
};
