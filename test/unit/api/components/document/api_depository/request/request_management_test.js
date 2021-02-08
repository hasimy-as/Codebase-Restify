const sinon = require('sinon');

const main = require('../../../../../../../app/api/components/document/api_depository/request/main');
const requestManage = require('../../../../../../../app/api/components/document/api_depository/request/request_management');

const { CODE } = require('../../../../../../../app/lib/http_code');

describe('Unit document request', () => {
  let resultDocument, resultDelete;

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

  resultDelete = {
    err: null,
    message: '',
    data: null,
    code: CODE.SUCCESS,
  };

  describe('Create document', () => {
    it('should fail to create document', async () => {
      sinon.stub(main.prototype, 'createDocument').resolves({ err: true });
      await requestManage.createDocument();
      main.prototype.createDocument.restore();
    });
    it('should success to create document', async () => {
      sinon.stub(main.prototype, 'createDocument').resolves(resultDocument);
      await requestManage.createDocument();
      main.prototype.createDocument.restore();
    });
  });

  describe('Update document', () => {
    it('should fail to update document', async () => {
      sinon.stub(main.prototype, 'updateDocument').resolves({ err: true });
      await requestManage.updateDocument();
      main.prototype.updateDocument.restore();
    });
    it('should success to update user', async () => {
      sinon.stub(main.prototype, 'updateDocument').resolves(resultDocument);
      await requestManage.updateDocument();
      main.prototype.updateDocument.restore();
    });
  });

  describe('Delete document', () => {
    it('should fail to delete document', async () => {
      sinon.stub(main.prototype, 'deleteDocument').resolves({ err: true });
      await requestManage.deleteDocument();
      main.prototype.deleteDocument.restore();
    });
    it('should success to delete document', async () => {
      sinon.stub(main.prototype, 'deleteDocument').resolves(resultDelete);
      await requestManage.deleteDocument();
      main.prototype.deleteDocument.restore();
    });
  });
});
