const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const main = require('../../../../../../../app/api/components/user/api_depository/request/main');
const request = require('../../../../../../../app/api/components/user/api_depository/request/request');
const response = require('../../../../../../../app/api/components/user/api_depository/response/response');
const jwtAuth = require('../../../../../../../app/api/auth/jwt_auth');

const user = new main();

describe('Unit user main request', () => {
  let payload, payloadLogin, resultUser, resultLogin, token;

  payload = {
    userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    name: 'Hasimy',
    address: 'Indonesia',
    username: 'alkosim',
    password: 'kosims'
  };

  payloadLogin = {
    username: 'alkosim',
    password: 'kosims'
  };

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

  token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NjNhMjU0Mi0yZmE4LTQyNzEtYmRmNi00MTVmNTk0MzJiZTEiLCJ1c2Vyb
      mFtZSI6InBfanlvdW5nIiwibmFtZSI6IlBhcmsgSm9vIFlvdW5nIiwiZXhwaXJlc0luIjo4NjQwMDAsImlhdCI6MTYxMjcwOTA0MiwiZXhwIjoxNjEyNzk1NDQyL
      CJpc3MiOiJoYXNpbXktYXMifQ.QdBNvNoxd7FH4tmM4TGBhPOvlXaybgc_dxKOmsKUoWXtZoKlmV3DDV6__jN6cwku-9wVXQFup9R5z6p78z3zBjdi1L-bmp-0GI
      QmN9sbFuL8rERuLZV3yrauzk3UcWNRWcMRIJi6Az3rvLyy1dVbs6B9UvWQS7TNUC28FZrs1s3UaeX94J4lDmyh92h9Br4w_fey4vsXrUvipJLnjoqi8weLpokjQQ
      61NpO3F7usKrNYOKwp_9YVNcHMjBX5JuJF6wZsG3BXwoBR_J1jfLFzZFwqwI1Va21fKrh0IWOBylO039Bymj5VEU7BEiDeUeXMdK3qascOrzmn1Pf0R4eb5pS7PF
      jF6-n7njWY_S3PRg-f5spUoYaMAa_v2v0cN8T9GjpK9VJv3i9dKGWNXXaCYRFGFAIgcohU8sXDK7UMshOLKQ1VtrhCYadOd9agZ5anEMe1yioqknZ-4mj9wdV5S4
      IfL1_S2KN9nK-cjTYbxmt19EunLz3CoGtqH1FMsCUIhC9VjfeByCgJPAcXAHbdMkKqSlX8C1KC34nllbZQSCx4j3YhLTgNuDr5SLqQWtOAMhVntSv5TUxsrNAx0j
      gpcyi9NwXTdN8yQPfjG7Lg3cRNNkIet3YN6HiRc9zK20z6I4cEn-gDqEHOBSe4Eoe3njfF5ndZy92id-MySf26BKA`;

  resultLogin = {
    err: null,
    message: '',
    data: {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      username: 'alkosim',
      name: 'Hasimy',
      expiresIn: 864000,
      accessToken: token,
    },
    code: CODE.SUCCESS,
  };

  describe('Create user', () => {
    it('should fail to create user duplicate', async () => {
      sinon.stub(response, 'findOne').resolves(resultUser);
      sinon.stub(request, 'insertOne').resolves({ err: null });
      const res = await user.createUser(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.BAD_REQUEST);
      assert.equal(res.message, 'Username has been used');

      response.findOne.restore();
      request.insertOne.restore();
    });
    it('should fail to create user', async () => {
      sinon.stub(response, 'findOne').resolves({ err: null });
      sinon.stub(request, 'insertOne').resolves({ err: true });
      const res = await user.createUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to create user');

      response.findOne.restore();
      request.insertOne.restore();
    });
    it('should success to create user', async () => {
      sinon.stub(response, 'findOne').resolves({ err: null });
      sinon.stub(request, 'insertOne').resolves(resultUser);
      const res = await user.createUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.insertOne.restore();
    });
  });

  describe('Login user', () => {
    it('should fail to find user', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await user.loginUser(payloadLogin);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');

      response.findOne.restore();
    });
    // it('should success to login', async () => {
    //   sinon.stub(response, 'findOne').resolves(resultUser);
    //   sinon.stub(jwtAuth, 'generateToken').resolves(token);
    //   const res = await user.loginUser(payloadLogin);
    //   assert.equal(res.err, null);
    //   assert.equal(res.data, resultLogin);
    //   assert.equal(res.code, CODE.SUCCESS);
    //   assert.equal(res.message, 'Logged in');

    //   response.findOne.restore();
    //   jwtAuth.generateToken.restore();
    // });
  });

  describe('Update user', () => {
    const req = {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    };
    it('should fail to find user', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await user.updateUser(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');

      response.findOne.restore();
    });
    it('should fail to update user', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'updateOne').resolves({ err: true });
      const res = await user.updateUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to update user');

      response.findOne.restore();
      request.updateOne.restore();
    });
    it('should success to update user', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'updateOne').resolves(resultUser);
      const res = await user.updateUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.updateOne.restore();
    });
  });

  describe('Delete user', () => {
    const req = {
      userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
    };
    it('should fail to find user', async () => {
      sinon.stub(response, 'findOne').resolves({ err: true });
      const res = await user.deleteUser(req);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');

      response.findOne.restore();
    });
    it('should fail to delete user', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'deleteOne').resolves({ err: true });
      const res = await user.deleteUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to delete user');

      response.findOne.restore();
      request.deleteOne.restore();
    });
    it('should success to delete user', async () => {
      sinon.stub(response, 'findOne').resolves(req);
      sinon.stub(request, 'deleteOne').resolves(resultUser);
      const res = await user.deleteUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');

      response.findOne.restore();
      request.deleteOne.restore();
    });
  });
});
