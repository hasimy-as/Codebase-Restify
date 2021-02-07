const sinon = require('sinon');
const { expect } = require('chai');

const ops = require('../../../../../../app/api/components/user/api_operator/user_operator');

const requestManage = require('../../../../../../app/api/components/user/api_depository/request/request_management');
const requestSchema = require('../../../../../../app/api/components/user/api_depository/request/request_schema');

const responseManage = require('../../../../../../app/api/components/user/api_depository/response/response_management');
const responseSchema = require('../../../../../../app/api/components/user/api_depository/response/response_schema');

const { CODE } = require('../../../../../../app/lib/http_code');

describe('Unit user operator', () => {
  let res, payload, payloadLogin, result, resultUser;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      },
    };
  });

  payload = {
    name: 'Hasimy',
    address: 'Indonesia',
    username: 'alkosim',
    password: 'kosims'
  };

  payloadLogin = {
    username: 'alkosim',
    password: 'kosims'
  };

  result = {
    err: null,
    message: '',
    data: [
      {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
        name: 'Hasimy',
        address: 'Indonesia',
        username: 'alkosim',
        password: 'kosims'
      },
      {
        userId: 'a55bcea0-8f8a-4af8-b7c5-2f4b56d5aa1b',
        name: 'Hasims',
        address: 'Indonesia',
        username: 'thesims12',
        password: 'thesims'
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
      username: 'alkosim',
      password: 'kosims'
    },
    code: CODE.SUCCESS,
  };

  describe('Get users', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };
    it('should be a function', () => {
      expect(ops.getUsers).to.be.a('function');
    });
    it('should fail get users', async () => {
      sinon.stub(responseManage, 'getUsers').resolves({ err: true });
      expect(await ops.getUsers(req, res));
      responseManage.getUsers.restore();
    });
    it('should success get users', async () => {
      sinon.stub(responseManage, 'getUsers').resolves(result);
      expect(await ops.getUsers(req, res));
      responseManage.getUsers.restore();
    });
  });

  describe('Get user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };
    it('should be a function', () => {
      expect(ops.getOneUser).to.be.a('function');
    });
    it('should fail validating get user by userId schema', async () => {
      sinon
        .stub(responseSchema.getOneUserSchema, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.getOneUser(req, res));
      responseSchema.getOneUserSchema.validateAsync.restore();
    });
    it('should fail get user by userId', async () => {
      sinon.stub(responseManage, 'getOneUser').resolves({ err: true });
      expect(await ops.getOneUser(req, res));
      responseManage.getOneUser.restore();
    });
    it('should success get user by userId', async () => {
      sinon.stub(responseManage, 'getOneUser').resolves(resultUser);
      expect(await ops.getOneUser(req, res));
      responseManage.getOneUser.restore();
    });
  });

  describe('Create user', () => {
    const req = {
      body: payload,
    };
    it('should be a function', () => {
      expect(ops.createUser).to.be.a('function');
    });
    it('should fail validating create user schema', async () => {
      sinon
        .stub(requestSchema.createUser, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.createUser(req, res));
      requestSchema.createUser.validateAsync.restore();
    });
    it('should fail to create user', async () => {
      sinon.stub(requestManage, 'createUser').resolves({ err: true });
      expect(await ops.createUser(req, res));
      requestManage.createUser.restore();
    });
    it('should success to create user', async () => {
      sinon.stub(requestManage, 'createUser').resolves(resultUser);
      expect(await ops.createUser(req, res));
      requestManage.createUser.restore();
    });
  });

  describe('Login user', () => {
    const req = {
      body: payloadLogin,
    };

    it('should be a function', () => {
      expect(ops.loginUser).to.be.a('function');
    });
    it('should fail validating login schema', async () => {
      sinon
        .stub(requestSchema.loginUser, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.loginUser(req, res));
      requestSchema.loginUser.validateAsync.restore();
    });
    it('should fail to login', async () => {
      sinon.stub(requestManage, 'loginUser').resolves({ err: true });
      expect(await ops.loginUser(req, res));
      requestManage.loginUser.restore();
    });
    it('should success to login', async () => {
      sinon.stub(requestManage, 'loginUser').resolves(resultUser);
      expect(await ops.loginUser(req, res));
      requestManage.loginUser.restore();
    });
  });

  describe('Update user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
      body: payload,
    };
    it('should be a function', () => {
      expect(ops.updateUser).to.be.a('function');
    });
    it('should fail validating update exiting user schema', async () => {
      sinon
        .stub(requestSchema.updateUser, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.updateUser(req, res));
      requestSchema.updateUser.validateAsync.restore();
    });
    it('should fail to update existing user', async () => {
      sinon.stub(requestManage, 'updateUser').resolves({ err: true });
      expect(await ops.updateUser(req, res));
      requestManage.updateUser.restore();
    });
    it('should success to update existing user', async () => {
      sinon.stub(requestManage, 'updateUser').resolves({ data: req });
      expect(await ops.updateUser(req, res));
      requestManage.updateUser.restore();
    });
  });

  describe('Delete user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };
    it('should be a function', () => {
      expect(ops.deleteUser).to.be.a('function');
    });
    it('should fail validating delete user schema', async () => {
      sinon
        .stub(requestSchema.deleteUser, 'validateAsync')
        .resolves({ err: true });
      expect(await ops.deleteUser(req, res));
      requestSchema.deleteUser.validateAsync.restore();
    });
    it('should fail to delete user', async () => {
      sinon.stub(requestManage, 'deleteUser').resolves({ err: true });
      expect(await ops.deleteUser(req, res));
      requestManage.deleteUser.restore();
    });
    it('should success to delete user', async () => {
      sinon.stub(requestManage, 'deleteUser').resolves(result.data);
      expect(await ops.deleteUser(req, res));
      requestManage.deleteUser.restore();
    });
  });
});
