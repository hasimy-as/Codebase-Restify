const Document = require('./main');

const getDocument = async () => {
  const document = new Document();
  return document.getDocument();
};

const getDocumentById = async (payload) => {
  const document = new Document();
  return document.getDocumentById(payload);
};

module.exports = {
  getDocument,
  getDocumentById,
};
