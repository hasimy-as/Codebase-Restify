const sinon = require('sinon');

const main = require('../../../../../../../app/api/components/user/api_depository/request/main');
const requestManage = require('../../../../../../../app/api/components/user/api_depository/request/request_management');

const { CODE } = require('../../../../../../../app/lib/http_code');

describe('Unit user request', () => {
  let resultUser, resultDelete, resultLogin;

  resultUser = {
    err: null,
    message: '',
    data: {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      name: 'Hasimy',
      address: 'Indonesia',
      username: 'alkosim',
      password: 'kosims',
      createdAt: '2021-01-01T01:11:11.111Z',
      updatedAt: '2021-01-01T01:11:11.111Z',
    },
    code: CODE.SUCCESS,
  };

  resultDelete = {
    err: null,
    message: '',
    data: null,
    code: CODE.SUCCESS,
  };

  resultLogin = {
    err: null,
    message: '',
    data: {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      username: 'alkosim',
      name: 'Hasimy',
      expiresIn: 864000,
      accessToken: 'xyz'
    },
    code: CODE.SUCCESS
  };

  describe('Create user', () => {
    it('should fail to create user', async () => {
      sinon.stub(main.prototype, 'createUser').resolves({ err: true });
      await requestManage.createUser();
      main.prototype.createUser.restore();
    });
    it('should success to create user', async () => {
      sinon.stub(main.prototype, 'createUser').resolves(resultUser);
      await requestManage.createUser();
      main.prototype.createUser.restore();
    });
  });

  describe('Login user', () => {
    it('should fail to login', async () => {
      sinon.stub(main.prototype, 'loginUser').resolves({ err: true });
      await requestManage.loginUser();
      main.prototype.loginUser.restore();
    });
    it('should success to login', async () => {
      sinon.stub(main.prototype, 'loginUser').resolves(resultLogin);
      await requestManage.loginUser();
      main.prototype.loginUser.restore();
    });
  });

  describe('Update user', () => {
    it('should fail to update user', async () => {
      sinon.stub(main.prototype, 'updateUser').resolves({ err: true });
      await requestManage.updateUser();
      main.prototype.updateUser.restore();
    });
    it('should success to update user', async () => {
      sinon.stub(main.prototype, 'updateUser').resolves(resultUser);
      await requestManage.updateUser();
      main.prototype.updateUser.restore();
    });
  });

  describe('Delete user', () => {
    it('should fail to delete user', async () => {
      sinon.stub(main.prototype, 'deleteUser').resolves({ err: true });
      await requestManage.deleteUser();
      main.prototype.deleteUser.restore();
    });
    it('should success to delete user', async () => {
      sinon.stub(main.prototype, 'deleteUser').resolves(resultDelete);
      await requestManage.deleteUser();
      main.prototype.deleteUser.restore();
    });
  });
});
