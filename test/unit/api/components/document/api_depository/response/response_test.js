const sinon = require('sinon');

const db_commands = require('../../../../../../../app/database/db_commands');
const response = require('../../../../../../../app/api/components/document/api_depository/response/response');

const { CODE } = require('../../../../../../../app/lib/http_code');

describe('Unit document response', () => {
  let result, resultDocument;

  result = {
    err: null,
    message: '',
    data: [
      {
        _id: '601ee6fe89ad1230a5d4c291',
        documentId: 'f229fdf4-3cab-4a6c-bfac-2569bbcf1652',
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        title: 'Document 0',
        about: 'Top secret; how to make an instant noodle',
        document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        createdAt: '2021-01-01T11:11:11.111Z',
        createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
      {
        _id: '60206f3d2ee2f13415e0f6e6',
        documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        title: 'Document 1',
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
      title: 'Document 2',
      about: 'Top secret; how to make an instant tea',
      document: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: '2021-03-03T00:00:00.000Z',
      createdBy: 'e720b030-c441-4560-bb23-b88a60d2a1c1'
    }
  };

  describe('Get documents', () => {
    it('should success get documents', async () => {
      sinon.stub(db_commands.prototype, 'findMany').resolves(result);
      await response.findMany();
      db_commands.prototype.findMany.restore();
    });
  });

  describe('Get document by documentId', () => {
    it('should success get document by documentId', async () => {
      const req = {
        params: {
          documentId: '8fff5cf0-b264-4e95-99e2-5ee5e3926d0a',
        },
      };
      sinon.stub(db_commands.prototype, 'findOne').resolves(resultDocument);
      await response.findOne(req);
      db_commands.prototype.findOne.restore();
    });
  });
});
