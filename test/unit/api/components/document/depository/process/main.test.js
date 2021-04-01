const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/document/depository/process/main');
const Query = require('../../../../../../../app/api/components/document/depository/inquiry/query');
const Command = require('../../../../../../../app/api/components/document/depository/process/command');

const { ROLES } = require('../../../../../../../app/lib/fields');

const qProcess = Query.prototype;
const process = Command.prototype;

const main = new Main();

describe('Document processMain', () => {
  let payload;
  beforeEach(() => {
    payload = {
      title: 'Document 0',
      about: 'Top secret; how to sleep in 10 seconds',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      opts: {
        roles: ROLES.USER
      }
    };
  });

  describe('Create document', () => {
    it('should fail if access create is not a user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves();
      const res = await main.createDocument(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not a user!');
      qProcess.findOne.restore();
    });

    it('should error if document is already exist', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ code: CODE.SUCCESS });
      const res = await main.createDocument(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.BAD_REQUEST);
      assert.equal(res.message, 'Document with inserted title already exist!');
      qProcess.findOne.restore();
    });

    it('should fail creating document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: true });
      const res = await main.createDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to create document!');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });

    it('should success creating document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: null });
      const res = await main.createDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });
  });

  describe('Update document', () => {
    it('should fail if access create is not a user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves();
      const res = await main.createDocument(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not a user!');
      qProcess.findOne.restore();
    });

    it('should error finding document before update', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.updateDocument(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Document not found!');
      qProcess.findOne.restore();
    });

    it('should fail updating document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: true });
      const res = await main.updateDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to update document!');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });

    it('should success updating document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: null });
      const res = await main.updateDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });
  });

  describe('Delete document', () => {
    it('should fail if access create is not a user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves();
      const res = await main.deleteDocument(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not a user!');
      qProcess.findOne.restore();
    });

    it('should error finding document before delete', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.deleteDocument(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Document not found!');
      qProcess.findOne.restore();
    });

    it('should fail deleting document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: true });
      const res = await main.deleteDocument(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to delete document!');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });

    it('should success deleting document', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: null });
      const res = await main.deleteDocument(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });
  });
});

