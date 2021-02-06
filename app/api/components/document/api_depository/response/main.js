const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const response = require('./response');

class Document {
  async getDocument() {
    const document = await response.findMany();
    if (document.err) {
      return wrapper.error(
        'error',
        'Application error',
        CODE.INTERNAL_ERROR,
      );
    }
    const { data } = document;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async getDocumentById(payload) {
    const document = await response.findOne({ documentId: payload.documentId });
    if (document.err) {
      return wrapper.error(
        'error',
        'Document not found!',
        CODE.NOT_FOUND,
      );
    }
    const { data } = document;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = Document;
