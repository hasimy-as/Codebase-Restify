const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const main = require('../../../../../../../app/api/components/user/api_depository/response/main');
const response = require('../../../../../../../app/api/components/user/api_depository/response/response');

const user = new main();

describe('Unit user main response', () => {
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
      sinon.stub(response, 'findMany').resolves({ err: true });
      const res = await user.getUsers();
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Application error');

      response.findMany.restore();
    });

    it('should fail get users', async () => {
      sinon.stub(response, 'findMany').resolves(result);
      const res = await user.getUsers();
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findMany.restore();
    });
  });

  describe('Get user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };
    it('should fail get user by userId', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await user.getOneUser(req);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');

      response.findOne.restore();
    });

    it('should success get user by userId', async () => {
      sinon.stub(response, 'findOne').resolves(resultUser);
      const res = await user.getOneUser(req);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
    });
  });
});
