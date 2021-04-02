const sinon = require('sinon');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/document/depository/inquiry/main');
const handler = require('../../../../../../../app/api/components/document/depository/inquiry/handler');

describe('Document inquiryHandler', async () => {
  let resultAll;
  let resultDetail;
  let main = Main.prototype;

  resultDetail = {
    err: null,
    message: '',
    data: {
      _id: '601ee6fe89ad1230a5d4c291',
      documentId: 'f229fdf4-3cab-4a6c-bfac-2569bbcf1652',
      title: 'Document 1',
      about: 'Top secret; how to make an instant noodle',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: '2021-01-01T11:11:11.111Z',
      createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    },
    code: CODE.SUCCESS
  };

  resultAll = {
    err: null,
    message: '',
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
    code: CODE.SUCCESS
  };

  it('should success get all documents', async () => {
    sinon.stub(main, 'getDocument').resolves(resultAll);
    await handler.getDocument();
    main.getDocument.restore();
  });

  it('should success get document by documentId', async () => {
    sinon.stub(main, 'getDocumentById').resolves(resultDetail);
    await handler.getDocumentById();
    main.getDocumentById.restore();
  });
});
