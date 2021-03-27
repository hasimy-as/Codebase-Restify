require('joi');

const { sendResponse } = require('../../../../helpers/response');
const requestSchema = require('../api_depository/request/request_schema');
const requestManage = require('../api_depository/request/request_management');

const responseManage = require('../api_depository/response/response_management');
const responseSchema = require('../api_depository/response/response_schema');

const getDocument = async (req, res) => {
  const result = await responseManage.getDocument();
  return sendResponse(result, res);
};

const getDocumentById = async (req, res) => {
  const { params } = req;
  const parameter = await responseSchema.getDocumentById.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await responseManage.getDocumentById(parameter);
  return sendResponse(result, res);
};

const createDocument = async (req, res) => {
  let { body, opts } = req;
  const data = await requestSchema.createDocument.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await requestManage.createDocument(data, { opts });
  return sendResponse(result, res);
};

const updateDocument = async (req, res) => {
  let { body, params } = req;
  body = Object.assign(body, params);
  const data = await requestSchema.updateDocument.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await requestManage.updateDocument(data);
  return sendResponse(result, res);
};

const deleteDocument = async (req, res) => {
  const { params } = req;
  const parameter = await requestSchema.deleteDocument.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await requestManage.deleteDocument(parameter);
  return sendResponse(result, res);
};

module.exports = {
  getDocument,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
