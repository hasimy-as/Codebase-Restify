const sinon = require('sinon');

const main = require('../../../../../../../app/api/components/user/api_depository/response/main');
const responseManage = require('../../../../../../../app/api/components/user/api_depository/response/response_management');

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
    it('should fail get users', async () => {
      sinon.stub(main.prototype, 'getUsers').resolves({ err: true });
      await responseManage.getUsers();
      main.prototype.getUsers.restore();
    });
    it('should success get users', async () => {
      sinon.stub(main.prototype, 'getUsers').resolves(result);
      await responseManage.getUsers();
      main.prototype.getUsers.restore();
    });
  });

  describe('Get user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };

    it('should success get user by userId', async () => {
      sinon.stub(main.prototype, 'getOneUser').resolves({ err: true });
      await responseManage.getOneUser(req);
      main.prototype.getOneUser.restore();
    });

    it('should success get user by userId', async () => {
      sinon.stub(main.prototype, 'getOneUser').resolves(resultUser);
      await responseManage.getOneUser(req);
      main.prototype.getOneUser.restore();
    });
  });
});
