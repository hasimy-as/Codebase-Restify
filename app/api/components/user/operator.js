require('joi');

const { sendResponse } = require('../../../helpers/response');
const processHandler = require('./depository/process/handler');
const processSchema = require('./depository/process/schema');

const inquiryHandler = require('./depository/inquiry/handler');
const inquirySchema = require('./depository/inquiry/schema');

const getUsers = async (req, res) => {
  const result = await inquiryHandler.getUsers();
  return sendResponse(result, res);
};

const getUserById = async (req, res) => {
  const { params } = req;
  const parameter = await inquirySchema.getUserByIdSchema.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await inquiryHandler.getUserById(parameter);
  return sendResponse(result, res);
};

const createUser = async (req, res) => {
  let { body, opts } = req;
  const data = await processSchema.createUser.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.createUser({ ...data, opts });
  return sendResponse(result, res);
};

const loginUser = async (req, res) => {
  let { body } = req;
  const data = await processSchema.loginUser.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.loginUser(data);
  return sendResponse(result, res);
};

const updateUser = async (req, res) => {
  let { body, params, opts } = req;
  body = Object.assign(body, params);
  const data = await processSchema.updateUser.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.updateUser({ ...data, opts });
  return sendResponse(result, res);
};

const deleteUser = async (req, res) => {
  const { params, opts } = req;
  const parameter = await processSchema.deleteUser.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await processHandler.deleteUser({ ...parameter, opts });
  return sendResponse(result, res);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
