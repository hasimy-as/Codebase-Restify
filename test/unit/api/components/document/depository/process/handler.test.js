const sinon = require('sinon');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/document/depository/process/main');
const handler = require('../../../../../../../app/api/components/document/depository/process/handler');

describe('Document processHandler', async () => {
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

  it('should success inserting a document', async () => {
    sinon.stub(main, 'createDocument').resolves(resultDetail);
    await handler.createDocument();
    main.createDocument.restore();
  });

  it('should success updating a document', async () => {
    sinon.stub(main, 'updateDocument').resolves(resultDetail);
    await handler.updateDocument();
    main.updateDocument.restore();
  });

  it('should success deleting a document', async () => {
    sinon.stub(main, 'deleteDocument').resolves(resultDetail);
    await handler.deleteDocument();
    main.deleteDocument.restore();
  });
});
