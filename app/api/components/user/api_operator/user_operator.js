require('joi');

const { sendResponse } = require('../../../../lib/responses');
const requestSchema = require('../api_depository/request/request_schema');
const requestManage = require('../api_depository/request/request_management');

const responseManage = require('../api_depository/response/response_management');
const responseSchema = require('../api_depository/response/response_schema');

const getUsers = async (req, res) => {
  const result = await responseManage.getUsers();
  return sendResponse(result, res);
};

const getOneUser = async (req, res) => {
  const { params } = req;
  const parameter = await responseSchema.getOneUserSchema.validateAsync(
    params,
  );
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await responseManage.getOneUser(parameter);
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

const updateUser = async (req, res) => {
  let { body, params } = req;
  body = Object.assign(body, params);
  const data = await requestSchema.updateUser.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await requestManage.updateUser(data);
  return sendResponse(result, res);
};

const deleteUser = async (req, res) => {
  const { params } = req;
  const parameter = await requestSchema.deleteUser.validateAsync(
    params,
  );
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await requestManage.deleteUser(parameter);
  return sendResponse(result, res);
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
};
