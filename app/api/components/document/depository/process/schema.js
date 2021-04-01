const joi = require('joi');

const createDocument = joi.object({
  title: joi.string().max(60).required(),
  about: joi.string().max(250).required(),
  document: joi.string().required()
});

const updateDocument = joi.object({
  documentId: joi.string().guid().required(),
  title: joi.string().max(60).required(),
  about: joi.string().max(250).required(),
  document: joi.string().required()
});

const deleteDocument = joi.object({
  documentId: joi.string().guid().required(),
});

module.exports = {
  createDocument,
  updateDocument,
  deleteDocument,
};
