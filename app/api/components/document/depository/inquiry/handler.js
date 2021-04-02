const mongodb = require('../../../../../database/mongodb/commands');
const config = require('../../../../../config/config');
const db = new mongodb(config.get('/mongo'));

const Document = require('./main');
const document = new Document(db);

const getDocument = async () => {
  return document.getDocument();
};

const getDocumentById = async (payload) => {
  return document.getDocumentById(payload);
};

module.exports = {
  getDocument,
  getDocumentById,
};
