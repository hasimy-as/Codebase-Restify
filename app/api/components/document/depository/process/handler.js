const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const Document = require('./main');
const document = new Document(db);

const createDocument = async (payload) => {
  return document.createDocument(payload);
};

const updateDocument = async (payload) => {
  return document.updateDocument(payload);
};

const deleteDocument = async (payload) => {
  return document.deleteDocument(payload);
};

module.exports = {
  createDocument,
  updateDocument,
  deleteDocument,
};
