const uuid = require('uuid');

const { ROLES } = require('../../../../../lib/fields');
const { CODE } = require('../../../../../lib/http_code');

const logger = require('../../../../../helpers/logger');
const wrapper = require('../../../../../helpers/wrapper');

const Command = require('./command');
const Query = require('../inquiry/query');

class Document {
  constructor(db) {
    this.process = new Command(db);
    this.qProcess = new Query(db);
  }

  async createDocument(payload) {
    const ctx = 'Document-createDocument';
    const { opts, ...payloadVal } = payload;
    if (opts.roles !== ROLES.USER) {
      logger.error(ctx, 'This account is not a user.', 'Error');
      return wrapper.error('fail', 'This account is not a user!', CODE.UNAUTHORIZED);
    }

    const findDocument = await this.qProcess.findOne({ title: payload.title });
    if (findDocument.code === CODE.SUCCESS) {
      logger.error(ctx, 'Document with inserted title already exist.', 'Error');
      return wrapper.error('error', 'Document with inserted title already exist!', CODE.BAD_REQUEST);
    }

    const { data: document, err: documentErr } = await this.process.insertOne({
      documentId: uuid(),
      ...payloadVal,
      createdAt: new Date().toISOString(),
      createdBy: opts.userId
    });

    if (documentErr) {
      logger.error(ctx, 'Failed to create document.', documentErr);
      return wrapper.error('fail', 'Failed to create document!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(document, '', CODE.SUCCESS);
  }

  async updateDocument(payload) {
    const ctx = 'Document-updateDocument';
    const { opts, ...payloadVal } = payload;
    if (opts.roles !== ROLES.USER) {
      logger.error(ctx, 'This account is not a user.', 'Error');
      return wrapper.error('fail', 'This account is not a user!', CODE.UNAUTHORIZED);
    }

    const findDocument = await this.qProcess.findOne({ documentId: payload.documentId });
    if (findDocument.err) {
      logger.error(ctx, 'Document not found.', findDocument.err);
      return wrapper.error('error', 'Document not found!', CODE.NOT_FOUND);
    }

    const { data: document, err: documentErr } = await this.process.updateOne(
      { documentId: payload.documentId },
      { $set: {
        title: payload.title,
        about: payload.about,
        document: payload.document,
        updatedAt: new Date().toISOString(),
        updatedBy: opts.userId
      }},
    );
    if (documentErr) {
      logger.error(ctx, 'Failed to update document.', documentErr);
      return wrapper.error('fail', 'Failed to update document!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(document, '', CODE.SUCCESS);
  }

  async deleteDocument(payload) {
    const ctx = 'Document-deleteDocument';
    const { opts } = payload;
    if (opts.roles !== ROLES.USER) {
      logger.error(ctx, 'This account is not a user.', 'Error');
      return wrapper.error('fail', 'This account is not a user!', CODE.UNAUTHORIZED);
    }

    const findDocument = await this.qProcess.findOne({ documentId: payload.documentId });
    if (findDocument.err) {
      logger.error(ctx, 'Document not found.', findDocument.err);
      return wrapper.error('error', 'Document not found!', CODE.NOT_FOUND);
    }

    const { data: document, err: documentErr } = await this.process.deleteOne({ documentId: payload.documentId });
    if (documentErr) {
      logger.error(ctx, 'Failed to delete document.', documentErr);
      return wrapper.error('fail', 'Failed to delete document!', CODE.INTERNAL_ERROR);
    }

    return wrapper.data(document, '', CODE.SUCCESS);
  }
}

module.exports = Document;
