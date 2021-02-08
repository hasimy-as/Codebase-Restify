const uuid = require('uuid');

const logger = require('../../../../../lib/logger');
const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const request = require('./request');
const response = require('../response/response');

class Document {
  async createDocument(payload) {
    const ctx = 'Document-createDocument';
    const findDocument = await response.findOne({ title: payload.title });
    if (findDocument.code === CODE.SUCCESS) {
      logger.log(ctx, 'Document with inserted title already exist.', 'Error');
      return wrapper.error('error', 'Document with inserted title already exist', CODE.BAD_REQUEST);
    }

    const documentData = {
      documentId: uuid(),
      ...payload,
      createdAt: new Date().toISOString(),
      createdBy: payload.userId
    };

    const document = await request.insertOne(documentData);
    if (document.err) {
      logger.log(ctx, 'Failed to create document.', document.err);
      return wrapper.error('fail', 'Failed to create document', CODE.INTERNAL_ERROR);
    }

    const { data } = document;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async updateDocument(payload) {
    const ctx = 'Document-updateDocument';
    const findDocumentId = await response.findOne({ documentId: payload.documentId });
    if (findDocumentId.err) {
      logger.log(ctx, 'Document not found.', findDocumentId.err);
      return wrapper.error('error', 'Document not found!', CODE.NOT_FOUND);
    }

    const document = await request.updateOne(
      { documentId: payload.documentId },
      { $set: {
        title: payload.title,
        about: payload.about,
        document: payload.document,
        updatedAt: new Date().toISOString(),
        updatedBy: payload.userId
      }},
    );
    if (document.err) {
      logger.log(ctx, 'Failed to update document.', document.err);
      return wrapper.error('fail', 'Failed to update document', CODE.INTERNAL_ERROR);
    }

    const { data } = document;
    return wrapper.data(data, '', CODE.SUCCESS);
  }

  async deleteDocument(payload) {
    const ctx = 'Document-deleteDocument';
    const findDocumentId = await response.findOne({ documentId: payload.documentId });
    if (findDocumentId.err) {
      logger.log(ctx, 'Document not found.', findDocumentId.err);
      return wrapper.error('error', 'Document not found!', CODE.NOT_FOUND);
    }

    const document = await request.deleteOne({ documentId: payload.documentId });
    if (document.err) {
      logger.log(ctx, 'Failed to delete document.', document.err);
      return wrapper.error('fail', 'Failed to delete document', CODE.INTERNAL_ERROR);
    }

    const { data } = document;
    return wrapper.data(data, '', CODE.SUCCESS);
  }
}

module.exports = Document;
