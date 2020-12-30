/**
 * @description 
 * In Development
 */

require('joi');

const { sendResponse } = require('../../../../lib/responses');
const requestSchema = require('../api_depository/request/request_schema');
const requestManage = require('../api_depository/request/request_management');

const responseManage = require('../api_depository/response/response_management');

const getUsers = async (req, res) => {
	const result = await responseManage.getUsers();
	return sendResponse(result, res);
};

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
	getUsers,
	createUser,
};
