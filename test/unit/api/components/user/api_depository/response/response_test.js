const sinon = require('sinon');

const db_commands = require('../../../../../../../app/database/db_commands');
const response = require('../../../../../../../app/api/components/user/api_depository/response/response');

const { CODE } = require('../../../../../../../app/lib/http_code');

describe('Unit user response', () => {
  let result, resultUser;

  result = {
    err: null,
    message: '',
    data: [
      {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        name: 'Hasimy',
        address: 'Indonesia',
      },
      {
        userId: 'a55bcea0-8f8a-4af8-b7c5-2f4b56d5aa1b',
        name: 'Hasims',
        address: 'Indonesia',
      },
    ],
    code: CODE.SUCCESS,
  };

  resultUser = {
    err: null,
    message: '',
    data: {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      name: 'Hasimy',
      address: 'Indonesia',
    },
    code: CODE.SUCCESS,
  };

  describe('Get users', () => {
    it('should success get users', async () => {
      sinon.stub(db_commands.prototype, 'findMany').resolves(result);
      await response.findMany();
      db_commands.prototype.findMany.restore();
    });
  });

  describe('Get user by userId', () => {
    it('should success get user by userId', async () => {
      const req = {
        params: {
          userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        },
      };
      sinon.stub(db_commands.prototype, 'findOne').resolves(resultUser);
      await response.findOne(req);
      db_commands.prototype.findOne.restore();
    });
  });
});
