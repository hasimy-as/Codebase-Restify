const sinon = require('sinon');
const { expect } = require('chai');

const { CODE } = require('../../../../../app/lib/http_code');

const operator = require('../../../../../app/api/components/document/operator');

const inquiryHandler = require('../../../../../app/api/components/document/depository/inquiry/handler');
const inquirySchema = require('../../../../../app/api/components/document/depository/inquiry/schema');

const processSchema = require('../../../../../app/api/components/document/depository/process/schema');
const processHandler = require('../../../../../app/api/components/document/depository/process/handler');

describe('Document operator', () => {
  let res, payload, resultDetail, resultAll;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      },
    };
  });

  payload = {
    title: 'Document 0',
    about: 'Top secret; how to sleep in 10 seconds',
    document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  resultDetail = {
    success: true,
    data: {
      _id: '601ee6fe89ad1230a5d4c291',
      documentId: 'f229fdf4-3cab-4a6c-bfac-2569bbcf1652',
      title: 'Document 1',
      about: 'Top secret; how to make an instant noodle',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: '2021-01-01T11:11:11.111Z',
      createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    },
    message: 'Request Processed Completely',
    code: CODE.SUCCESS
  };

  resultAll = {
    success: true,
    data: [
      {
        _id: '60206f3d2ee2f13415e0f6e6',
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
        title: 'Document 2',
        about: 'Top secret; how to make an instant coffee',
        document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        createdAt: '2021-02-02T22:22:22.222Z',
        createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1'
      }
    ],
    message: 'Request Processed Completely',
    code: CODE.SUCCESS
  };

  describe('Get documents', () => {
    it('should be a function', () => {
      expect(operator.getDocument).to.be.a('function');
    });

    it('should success get documents', async () => {
      sinon.stub(inquiryHandler, 'getDocument').resolves(resultAll);
      expect(await operator.getDocument({}, res));
      inquiryHandler.getDocument.restore();
    });

    it('should error get documents', async () => {
      sinon.stub(inquiryHandler, 'getDocument').resolves({ err: true });
      expect(await operator.getDocument({}, res));
      inquiryHandler.getDocument.restore();
    });
  });

  describe('Get document by documentId', () => {
    const req = {
      params: {
        documentId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901'
      }
    };

    it('should be a function', () => {
      expect(operator.getDocumentById).to.be.a('function');
    });

    it('should success get document by id', async () => {
      sinon.stub(inquiryHandler, 'getDocumentById').resolves(resultDetail);
      expect(await operator.getDocumentById(req, res));
      inquiryHandler.getDocumentById.restore();
    });

    it('should error validate documentId schema', async () => {
      sinon.stub(inquirySchema.getDocumentById, 'validateAsync').resolves({ err: true });
      expect(await operator.getDocumentById(req, res));
      inquirySchema.getDocumentById.validateAsync.restore();
    });
  });

  describe('Create document', () => {
    const req = {
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.createDocument).to.be.a('function');
    });

    it('should success to create a document', async () => {
      sinon.stub(processHandler, 'createDocument').resolves(resultDetail);
      expect(await operator.createDocument(req, res));
      processHandler.createDocument.restore();
    });

    it('should fail to validate document schema', async () => {
      sinon.stub(processSchema.createDocument, 'validateAsync').resolves({ err: true });
      expect(await operator.createDocument(req, res));
      processSchema.createDocument.validateAsync.restore();
    });

    it('should fail to create an document', async () => {
      sinon.stub(processHandler, 'createDocument').resolves({ err: true });
      expect(await operator.createDocument(req, res));
      processHandler.createDocument.restore();
    });
  });

  describe('Update document by documentId', () => {
    const req = {
      params: {
        documentId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901',
      },
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.updateDocument).to.be.a('function');
    });

    it('should success to update existing document', async () => {
      sinon.stub(processHandler, 'updateDocument').resolves({ data: req });
      expect(await operator.updateDocument(req, res));
      processHandler.updateDocument.restore();
    });

    it('should fail to validate update document schema', async () => {
      sinon.stub(processSchema.updateDocument, 'validateAsync').resolves({ err: true });
      expect(await operator.updateDocument(req, res));
      processSchema.updateDocument.validateAsync.restore();
    });

    it('should fail to update existing document', async () => {
      sinon.stub(processHandler, 'updateDocument').resolves({ err: true });
      expect(await operator.updateDocument(req, res));
      processHandler.updateDocument.restore();
    });
  });

  describe('Delete document by documentId', () => {
    const req = {
      params: {
        documentId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };

    it('should be a function', () => {
      expect(operator.deleteDocument).to.be.a('function');
    });

    it('should success to delete document', async () => {
      sinon.stub(processHandler, 'deleteDocument').resolves(resultDetail.data);
      expect(await operator.deleteDocument(req, res));
      processHandler.deleteDocument.restore();
    });

    it('should fail validating delete document schema', async () => {
      sinon.stub(processSchema.deleteDocument, 'validateAsync').resolves({ err: true });
      expect(await operator.deleteDocument(req, res));
      processSchema.deleteDocument.validateAsync.restore();
    });

    it('should fail to delete document', async () => {
      sinon.stub(processHandler, 'deleteDocument').resolves({ err: true });
      expect(await operator.deleteDocument(req, res));
      processHandler.deleteDocument.restore();
    });
  });
});
