const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

// const jwtAuth = require('../../../../../../../app/api/auth/jwt_auth');

// const Redis = require('../../../../../../../app/database/redis/commands');
const Main = require('../../../../../../../app/api/components/user/depository/process/main');
const Query = require('../../../../../../../app/api/components/user/depository/inquiry/query');
const Command = require('../../../../../../../app/api/components/user/depository/process/command');

const { ROLES } = require('../../../../../../../app/lib/fields');
// const { ROLES, REDIS_KEY } = require('../../../../../../../app/lib/fields');

// const client = Redis.prototype;
const qProcess = Query.prototype;
const process = Command.prototype;

const main = new Main();

describe('User processMain', () => {
  // let token, expiresIn, resultDetail, payload, payloadLogin;
  let resultDetail, payload, payloadLogin;
  beforeEach(() => {
    // expiresIn = 86400;
    // token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNzJhOTkyYzAtM2I5Ni00MmE1LWI4MWMtNGFlY2QwNmEyZDU3IiwibmFtZSI6Ikhhc2lteSBNZCI
    //   sImVtYWlsIjoiNzJhOTkyYzAtM2I5Ni00MmE1LWI4MWMtNGFlY2QwNmEyZDU3IiwiYWRkcmVzcyI6IkluZG9uZXNpYSIsInJvbGVzIjoiMSIsImV4cGlyZXNJbiI6ODY0MDAwLC
    //   JrZXkiOiJzdXBlci1hZG1pbiIsImlhdCI6MTYxNzI2MTk1MiwiZXhwIjoxNjE3MzQ4MzUyLCJpc3MiOiJoYXNpbXktYXMifQ.tJwkuJ0KEg_cJUAYLNqdWBWw-JYmiDrNgGDNps
    //   wjF-PRizJxLaThxKnrFRrgGdCIF1x-pBiqXEt4DsHc1UVChdeD01BcskRf3CbAgqY1b9zuiKLfchCQBo_3mCXk8xhF5NfdYTTgFpiCxPQRsUm2Nm_ZONHmyxyoNpVbVWxdevQPH
    //   r4WnZgwe78aRYYNYiP8d3XMe74tKdUEELjTwYSlQKHCdoisSpGgQtaO06EokF236Vvz2EWG-dbm-OJM8G06X6zjsllgJXYInJNlxsfAbbpee3uMkC4Nf-NADnsvIMEoGyOAq_Ki
    //   CDRyAwDKP1nb8qGCIpyBpK_cizE_p5q0qi9PPezjISPPcRwOVTZq7ytvnumm2gAdvcfs_9bT4gtajGq6YooZDXIOizdnE9D4WZGv4GmDPXcuwpYqp8Xg7awagKNcISOF9Edvthw
    //   0BN3a_6RyA_cvYknWEfkzNuDckJIDLop05W66fwvGOpE_6riQ5NERs_MjBhEZP9YdYyfdl4b6HucIUVvTJp8mvkgcFchkFduqFwTxpdzbZXiDfZ7qI2OOPEICYBNWbnnLN4A4os
    //   BaJJn9LbL2cNye82YosxL75qr0YhCdVvjn8l2nM-PmOhjz2X0kIvgR5fsy263BTIJBnos_bEOno_9ZxIc6rk4rcMyBUZAcY0LHZl9_Ewc`;

    resultDetail = {
      err: null,
      message: '',
      data: {
        userId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
        name: 'Hasimy Md',
        address: ' Indonesia',
        email: 'api-test@aol.com',
        password: '82eb8fe681ee2a0769151290e6181d3f',
        roles: '1',
        createdAt: '2021-03-25T16:43:09.119Z',
        _id: '605cbd9d0f072e73d9d58274'
      },
      code: CODE.SUCCESS
    };

    payload = {
      name: 'Hasimy Md',
      address: 'Indonesia',
      email: 'api-test@aol.com',
      password: '82eb8fe681ee2a0769151290e6181d3f',
      opts: {
        roles: ROLES.USER
      }
    };

    payloadLogin = {
      email: 'api-test@aol.com',
      password: '82eb8fe681ee2a0769151290e6181d3f',
    };
  });

  describe('Create user', () => {
    it('should fail if access create is not an admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves();
      const res = await main.createUser(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not an admin!');
      qProcess.findOne.restore();
    });

    it('should error if user is already exist', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ code: CODE.SUCCESS });
      const res = await main.createUser(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.BAD_REQUEST);
      assert.equal(res.message, 'Email has been used!');
      qProcess.findOne.restore();
    });

    it('should fail creating user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: true });
      const res = await main.createUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to create user!');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });

    it('should success creating user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: null });
      const res = await main.createUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });
  });

  describe('Login user', () => {
    it('should error if user not found', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.loginUser(payloadLogin);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');
      qProcess.findOne.restore();
    });

    it('should fail if not a user', async () => {
      resultDetail.data.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.loginUser(payloadLogin);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'Account is not a user!');
      qProcess.findOne.restore();
    });

    // it('should error if wrong password', async () => {
    //   payloadLogin.password = 'asas1312';
    //   sinon.stub(qProcess, 'findOne').resolves(resultDetail);
    //   const res = await main.loginUser(payloadLogin);
    //   assert.equal(res.err, 'error');
    //   assert.equal(res.code, CODE.BAD_REQUEST);
    //   assert.equal(res.message, 'Password incorrect!');
    //   qProcess.findOne.restore();
    // });

    // it('should success login user', async () => {
    //   let userMetaVal = resultDetail.data;
    //   let loginResponse = {
    //     userMetaVal,
    //     accessToken: token,
    //     key: REDIS_KEY.SUPER_ADMIN,
    //     expiresIn: expiresIn
    //   };
    //   delete loginResponse.password;
    //   sinon.stub(qProcess, 'findOne').resolves(resultDetail);
    //   sinon.stub(jwtAuth, 'generateToken').resolves(token);
    //   sinon.stub(client, 'setExpire').resolves({ err: null });
    //   const res = await main.loginUser(payloadLogin);
    //   assert.deepEqual(res.err, null);
    //   assert.deepEqual(res.data, resultDetail.data);
    //   assert.deepEqual(res.code, CODE.SUCCESS);
    //   assert.deepEqual(res.message, 'Logged in');
    //   qProcess.findOne.restore();
    //   jwtAuth.generateToken.restore();
    //   client.setExpire.restore();
    // });
  });

  describe('Update user', () => {
    it('should fail if access update is not an user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.updateUser(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not a user!');
      qProcess.findOne.restore();
    });

    it('should error finding user before update', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.updateUser(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');
      qProcess.findOne.restore();
    });

    it('should fail updating user', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: true });
      const res = await main.updateUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to update user!');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });

    it('should success updating user', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: null });
      const res = await main.updateUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });
  });

  describe('Delete user', () => {
    it('should fail if access delete is not an admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves();
      const res = await main.deleteUser(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not an admin!');
      qProcess.findOne.restore();
    });

    it('should error finding user before delete', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.deleteUser(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'User not found!');
      qProcess.findOne.restore();
    });

    it('should fail deleting user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: true });
      const res = await main.deleteUser(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to delete user!');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });

    it('should success deleting user', async () => {
      payload.opts.roles = ROLES.SUPER_ADMIN;
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: null });
      const res = await main.deleteUser(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });
  });
});

