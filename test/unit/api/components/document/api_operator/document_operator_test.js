const sinon = require('sinon');
const { expect } = require('chai');

const ops = require('../../../../../../app/api/components/document/api_operator/document_operator');

const requestManage = require('../../../../../../app/api/components/document/api_depository/request/request_management');
const requestSchema = require('../../../../../../app/api/components/document/api_depository/request/request_schema');

const responseManage = require('../../../../../../app/api/components/document/api_depository/response/response_management');
const responseSchema = require('../../../../../../app/api/components/document/api_depository/response/response_schema');

const { CODE } = require('../../../../../../app/lib/http_code');

describe('Unit document operator', () => {
  let res, payload, result, resultDocument;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      },
    };
  });

  payload = {
    userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    title: 'Document 0',
    about: 'Top secret; how to sleep in 10 seconds',
    document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  result = {
    err: null,
    message: '',
    data: [
      {
        _id: '601ee6fe89ad1230a5d4c291',
        documentId: 'f229fdf4-3cab-4a6c-bfac-2569bbcf1652',
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        title: 'Document 1',
        about: 'Top secret; how to make an instant noodle',
        document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        createdAt: '2021-01-01T11:11:11.111Z',
        createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
      {
        _id: '60206f3d2ee2f13415e0f6e6',
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        title: 'Document 2',
        about: 'Top secret; how to make an instant coffee',
        document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        createdAt: '2021-02-02T22:22:22.222Z',
        createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1'
      }
    ],
    code: CODE.SUCCESS
  };

  resultDocument = {
    err: null,
    message: '',
    data: {
      _id: '60206f3d2ee2f13415e0f6e6',
      documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      title: 'Document 3',
      about: 'Top secret; how to make an instant tea',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: '2021-03-03T00:00:00.000Z',
      createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1'
    }
  };

  describe('Get documents', () => {
    const req = {};

    it('should be a function', () => {
      expect(ops.getDocument).to.be.a('function');
    });
    it('should fail get documents', async () => {
      sinon.stub(responseManage, 'getDocument').resolves({ err: true });
      expect(await ops.getDocument(req, res));
      responseManage.getDocument.restore();
    });
    it('should success get documents', async () => {
      sinon.stub(responseManage, 'getDocument').resolves(result);
      expect(await ops.getDocument(req, res));
      responseManage.getDocument.restore();
    });
  });

  describe('Get document by documentId', () => {
    const req = {
      params: {
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a'
      }
    };

    it('should be a function', () => {
      expect(ops.getDocumentById).to.be.a('function');
    });
    it('should fail to validate getDocumentById schema', async () => {
      sinon
        .stub(responseSchema.getDocumentById, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.getDocumentById(req, res));
      responseSchema.getDocumentById.validateAsync.restore();
    });
    it('should fail getDocumentById', async () => {
      sinon.stub(responseManage, 'getDocumentById').resolves({ err: true });
      expect(await ops.getDocumentById(req, res));
      responseManage.getDocumentById.restore();
    });
    it('should success getDocumentById', async () => {
      sinon.stub(responseManage, 'getDocumentById').resolves(resultDocument);
      expect(await ops.getDocumentById(req, res));
      responseManage.getDocumentById.restore();
    });
  });

  describe('Create document', () => {
    const req = {
      body: payload
    };

    it('should be a function', () => {
      expect(ops.createDocument).to.be.a('function');
    });
    it('should fail to validate document schema', async () => {
      sinon
        .stub(requestSchema.createDocument, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.createDocument(req, res));
      requestSchema.createDocument.validateAsync.restore();
    });
    it('should fail to create document', async () => {
      sinon.stub(requestManage, 'createDocument').resolves({ err: true });
      expect(await ops.createDocument(req, res));
      requestManage.createDocument.restore();
    });
    it('should success creating document', async () => {
      sinon.stub(requestManage, 'createDocument').resolves(resultDocument);
      expect(await ops.createDocument(req, res));
      requestManage.createDocument.restore();
    });
  });

  describe('Update document by documentId', () => {
    const req = {
      params: {
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a'
      },
      body: payload
    };

    it('should be a function', () => {
      expect(ops.updateDocument).to.be.a('function');
    });
    it('should fail to validate update document schema', async () => {
      sinon
        .stub(requestSchema.updateDocument, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.updateDocument(req, res));
      requestSchema.updateDocument.validateAsync.restore();
    });
    it('should fail to updateDocument', async () => {
      sinon.stub(requestManage, 'updateDocument').resolves({ err: true });
      expect(await ops.updateDocument(req, res));
      requestManage.updateDocument.restore();
    });
    it('should success updateDocument', async () => {
      sinon.stub(requestManage, 'updateDocument').resolves({ data: req });
      expect(await ops.updateDocument(req, res));
      requestManage.updateDocument.restore();
    });
  });

  describe('Delete document by documentId', () => {
    const req = {
      params: {
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a'
      }
    };

    it('should be a function', () => {
      expect(ops.deleteDocument).to.be.a('function');
    });
    it('should fail to validate delete document schema', async () => {
      sinon
        .stub(requestSchema.deleteDocument, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.deleteDocument(req, res));
      requestSchema.deleteDocument.validateAsync.restore();
    });
    it('should fail to deleteDocument', async () => {
      sinon.stub(requestManage, 'deleteDocument').resolves({ err: true });
      expect(await ops.deleteDocument(req, res));
      requestManage.deleteDocument.restore();
    });
    it('should success deleteDocument', async () => {
      sinon.stub(requestManage, 'deleteDocument').resolves(result.data);
      expect(await ops.deleteDocument(req, res));
      requestManage.deleteDocument.restore();
    });
  });
});
