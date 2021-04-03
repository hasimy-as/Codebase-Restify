const Document = require('./main');

const createDocument = async (payload) => {
  const document = new Document();
  return document.createDocument(payload);
};

const updateDocument = async (payload) => {
  const document = new Document();
  return document.updateDocument(payload);
};

const deleteDocument = async (payload) => {
  const document = new Document();
  return document.deleteDocument(payload);
};

module.exports = {
  createDocument,
  updateDocument,
  deleteDocument,
};
