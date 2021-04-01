require('joi');

const { sendResponse } = require('../../../helpers/response');
const processSchema = require('./depository/process/schema');
const processHandler = require('./depository/process/handler');

const inquiryHandler = require('./depository/inquiry/handler');
const inquirySchema = require('./depository/inquiry/schema');

const getDocument = async (req, res) => {
  const result = await inquiryHandler.getDocument();
  return sendResponse(result, res);
};

const getDocumentById = async (req, res) => {
  const { params } = req;
  const parameter = await inquirySchema.getDocumentById.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await inquiryHandler.getDocumentById(parameter);
  return sendResponse(result, res);
};

const createDocument = async (req, res) => {
  let { body, opts } = req;
  const data = await processSchema.createDocument.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.createDocument(data, { opts });
  return sendResponse(result, res);
};

const updateDocument = async (req, res) => {
  let { body, params } = req;
  body = Object.assign(body, params);
  const data = await processSchema.updateDocument.validateAsync(body);
  if (data.err) {
    return sendResponse(data, res);
  }
  const result = await processHandler.updateDocument(data);
  return sendResponse(result, res);
};

const deleteDocument = async (req, res) => {
  const { params } = req;
  const parameter = await processSchema.deleteDocument.validateAsync(params);
  if (parameter.err) {
    return sendResponse(parameter, res);
  }
  const result = await processHandler.deleteDocument(parameter);
  return sendResponse(result, res);
};

module.exports = {
  getDocument,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
