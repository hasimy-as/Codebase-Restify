const sinon = require('sinon');
const { expect } = require('chai');

const { CODE } = require('../../../../../app/lib/http_code');

const operator = require('../../../../../app/api/components/user/operator');

const inquiryHandler = require('../../../../../app/api/components/user/depository/inquiry/handler');
const inquirySchema = require('../../../../../app/api/components/user/depository/inquiry/schema');

const processSchema = require('../../../../../app/api/components/user/depository/process/schema');
const processHandler = require('../../../../../app/api/components/user/depository/process/handler');

describe('User operator', () => {
  let res, payload, payloadLogin, resultDetail, resultAll;
  beforeEach(() => {
    res = {
      send: function () {
        return true;
      },
    };
  });

  payloadLogin = {
    email: 'api-test@aol.com',
    password: '82eb8fe681ee2a0769151290e6181d3f',
  };

  payload = {
    name: 'Hasimy Md',
    address: 'Indonesia',
    email: 'api-test@aol.com',
    password: '82eb8fe681ee2a0769151290e6181d3f',
  };

  resultDetail = {
    success: true,
    data: {
      userId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
      name: 'Hasimy Md',
      address: ' Indonesia',
      email: 'api-test@aol.com',
      password: '82eb8fe681ee2a0769151290e6181d3f',
      roles: '2',
      createdAt: '2021-03-25T16:43:09.119Z',
      _id: '605cbd9d0f072e73d9d58274'
    },
    message: 'Request Processed Completely',
    code: CODE.SUCCESS
  };

  resultAll = {
    success: true,
    data: [
      {
        userId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
        name: 'Hasimy Md',
        address: ' Indonesia',
        phone: '081234567890',
        email: 'api-test@aol.com',
        password: '82eb8fe681ee2a0769151290e6181d3f',
        roles: '2',
        createdAt: '2021-03-25T16:43:09.119Z',
        _id: '605cbd9d0f072e73d9d58274'
      }
    ],
    message: 'Request Processed Completely',
    code: CODE.SUCCESS
  };

  describe('Get users', () => {
    it('should be a function', () => {
      expect(operator.getUsers).to.be.a('function');
    });

    it('should success get users', async () => {
      sinon.stub(inquiryHandler, 'getUsers').resolves(resultAll);
      expect(await operator.getUsers({}, res));
      inquiryHandler.getUsers.restore();
    });

    it('should error get users', async () => {
      sinon.stub(inquiryHandler, 'getUsers').resolves({ err: true });
      expect(await operator.getUsers({}, res));
      inquiryHandler.getUsers.restore();
    });
  });

  describe('Get user by userId', () => {
    const req = {
      params: {
        userId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901'
      }
    };

    it('should be a function', () => {
      expect(operator.getUserById).to.be.a('function');
    });

    it('should success get user by id', async () => {
      sinon.stub(inquiryHandler, 'getUserById').resolves(resultDetail);
      expect(await operator.getUserById(req, res));
      inquiryHandler.getUserById.restore();
    });

    it('should error validate userId schema', async () => {
      sinon.stub(inquirySchema.getUserByIdSchema, 'validateAsync').resolves({ err: true });
      expect(await operator.getUserById(req, res));
      inquirySchema.getUserByIdSchema.validateAsync.restore();
    });
  });

  describe('Create user', () => {
    const req = {
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.createUser).to.be.a('function');
    });

    it('should success to create a user', async () => {
      sinon.stub(processHandler, 'createUser').resolves(resultDetail);
      expect(await operator.createUser(req, res));
      processHandler.createUser.restore();
    });

    it('should fail to validate user schema', async () => {
      sinon.stub(processSchema.createUser, 'validateAsync').resolves({ err: true });
      expect(await operator.createUser(req, res));
      processSchema.createUser.validateAsync.restore();
    });

    it('should fail to create an user', async () => {
      sinon.stub(processHandler, 'createUser').resolves({ err: true });
      expect(await operator.createUser(req, res));
      processHandler.createUser.restore();
    });
  });

  describe('Login user', () => {
    const req = {
      body: payloadLogin,
    };

    it('should be a function', () => {
      expect(operator.loginUser).to.be.a('function');
    });

    it('should success to login user', async () => {
      sinon.stub(processHandler, 'loginUser').resolves(resultDetail);
      expect(await operator.loginUser(req, res));
      processHandler.loginUser.restore();
    });

    it('should fail validating login user schema', async () => {
      sinon.stub(processSchema.loginUser, 'validateAsync').resolves({ err: true });
      expect(await operator.loginUser(req, res));
      processSchema.loginUser.validateAsync.restore();
    });

    it('should fail to login user', async () => {
      sinon.stub(processHandler, 'loginUser').resolves({ err: true });
      expect(await operator.loginUser(req, res));
      processHandler.loginUser.restore();
    });
  });

  describe('Update user by userId', () => {
    const req = {
      params: {
        userId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901',
      },
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.updateUser).to.be.a('function');
    });

    it('should success to update existing user', async () => {
      sinon.stub(processHandler, 'updateUser').resolves({ data: req });
      expect(await operator.updateUser(req, res));
      processHandler.updateUser.restore();
    });

    it('should fail to validate update user schema', async () => {
      sinon.stub(processSchema.updateUser, 'validateAsync').resolves({ err: true });
      expect(await operator.updateUser(req, res));
      processSchema.updateUser.validateAsync.restore();
    });

    it('should fail to update existing user', async () => {
      sinon.stub(processHandler, 'updateUser').resolves({ err: true });
      expect(await operator.updateUser(req, res));
      processHandler.updateUser.restore();
    });
  });

  describe('Delete user by userId', () => {
    const req = {
      params: {
        userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };

    it('should be a function', () => {
      expect(operator.deleteUser).to.be.a('function');
    });

    it('should success to delete user', async () => {
      sinon.stub(processHandler, 'deleteUser').resolves(resultDetail.data);
      expect(await operator.deleteUser(req, res));
      processHandler.deleteUser.restore();
    });

    it('should fail validating delete user schema', async () => {
      sinon.stub(processSchema.deleteUser, 'validateAsync').resolves({ err: true });
      expect(await operator.deleteUser(req, res));
      processSchema.deleteUser.validateAsync.restore();
    });

    it('should fail to delete user', async () => {
      sinon.stub(processHandler, 'deleteUser').resolves({ err: true });
      expect(await operator.deleteUser(req, res));
      processHandler.deleteUser.restore();
    });
  });
});
