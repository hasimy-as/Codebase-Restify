require('joi');

const { sendResponse } = require('../../../helpers/response');
const processHandler = require('./depository/process/handler');
const processSchema = require('./depository/process/schema');

const inquiryHandler = require('./depository/inquiry/handler');
const inquirySchema = require('./depository/inquiry/schema');

const getAdmins = async (req, res) => {
  const result = await inquiryHandler.getAdmins();
  return sendResponse(result, res);
};

const getAdminById = async (req, res) => {
  const { params } = req;
  const parameter = await inquirySchema.getAdminById.validateAsync(
    params,
  );
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await inquiryHandler.getAdminById(parameter);
  return sendResponse(result, res);
};

const createAdmin = async (req, res) => {
  let { body } = req;
  const data = await processSchema.createAdmin.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.createAdmin(data);
  return sendResponse(result, res);
};

const loginAdmin = async (req, res) => {
  let { body } = req;
  const data = await processSchema.loginAdmin.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.loginAdmin(data);
  return sendResponse(result, res);
};

const updateAdmin = async (req, res) => {
  let { body, params, opts } = req;
  body = Object.assign(body, params);
  const data = await processSchema.updateAdmin.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.updateAdmin({ ...data, opts });
  return sendResponse(result, res);
};

const deleteAdmin = async (req, res) => {
  const { params, opts } = req;
  const parameter = await processSchema.deleteAdmin.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await processHandler.deleteAdmin({ ...parameter, opts });
  return sendResponse(result, res);
};

module.exports = {
  getAdmins,
  getAdminById,
  createAdmin,
  loginAdmin,
  updateAdmin,
  deleteAdmin
};
