const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const main = require('../../../../../../../app/api/components/document/api_depository/request/main');
const request = require('../../../../../../../app/api/components/document/api_depository/request/request');
const response = require('../../../../../../../app/api/components/document/api_depository/response/response');

const document = new main();

describe('Unit document main request', () => {
  let payload, resultDocument;

  payload = {
    userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    title: 'Document 0',
    about: 'Top secret; how to sleep in 10 seconds',
    document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  resultDocument = {
    err: null,
    message: '',
    data: {
      _id: '60206f3d2ee2f13415e0f6e6',
      documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      title: 'Document 0',
      about: 'Top secret; how to make an instant tea',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: '2021-03-03T00:00:00.000Z',
      createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1'
    }
  };

  describe('Create document', () => {
    it('should fail to create document', async () => {
      sinon.stub(response, 'findOne').resolves({ err: null });
      sinon.stub(request, 'insertOne').resolves({ err: true });
      const res = await document.createDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to create document');

      response.findOne.restore();
      request.insertOne.restore();
    });
    it('should success to create document', async () => {
      sinon.stub(response, 'findOne').resolves({ err: null });
      sinon.stub(request, 'insertOne').resolves(resultDocument);
      const res = await document.createDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.insertOne.restore();
    });
  });

  describe('Update document', () => {
    const req = {
      documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
    };
    it('should fail to find document', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await document.updateDocument(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Document not found!');

      response.findOne.restore();
    });
    it('should fail to update document', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'updateOne').resolves({ err: true });
      const res = await document.updateDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to update document');

      response.findOne.restore();
      request.updateOne.restore();
    });
    it('should success to update document', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'updateOne').resolves(resultDocument);
      const res = await document.updateDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.updateOne.restore();
    });
  });

  describe('Delete document', () => {
    const req = {
      documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
    };
    it('should fail to find document', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await document.deleteDocument(req);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Document not found!');

      response.findOne.restore();
    });
    it('should fail to delete document', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'deleteOne').resolves({ err: true });
      const res = await document.deleteDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to delete document');

      response.findOne.restore();
      request.deleteOne.restore();
    });
    it('should success to delete document', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'deleteOne').resolves(resultDocument);
      const res = await document.deleteDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.deleteOne.restore();
    });
  });
});
