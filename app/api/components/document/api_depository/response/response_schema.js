const joi = require('joi');

const getDocumentById = joi.object({
  documentId: joi.string().guid().required(),
});

module.exports = {
  getDocumentById,
};
