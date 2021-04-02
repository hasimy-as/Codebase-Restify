const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

// const jwtAuth = require('../../../../../../../app/api/auth/jwt_auth');

// const Redis = require('../../../../../../../app/database/redis/commands');
const Main = require('../../../../../../../app/api/components/admin/depository/process/main');
const Query = require('../../../../../../../app/api/components/admin/depository/inquiry/query');
const Command = require('../../../../../../../app/api/components/admin/depository/process/command');

const { ROLES } = require('../../../../../../../app/lib/fields');
// const { ROLES, REDIS_KEY } = require('../../../../../../../app/lib/fields');

// const client = Redis.prototype;
const qProcess = Query.prototype;
const process = Command.prototype;

const main = new Main();

describe('Admin processMain', () => {
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
        adminId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
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
        roles: ROLES.SUPER_ADMIN
      }
    };

    payloadLogin = {
      email: 'api-test@aol.com',
      password: '82eb8fe681ee2a0769151290e6181d3f',
    };
  });

  describe('Create admin', () => {
    it('should error if admin is already exist', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ code: CODE.SUCCESS });
      const res = await main.createAdmin(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.BAD_REQUEST);
      assert.equal(res.message, 'Email has been used!');
      qProcess.findOne.restore();
    });

    it('should fail creating admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: true });
      const res = await main.createAdmin(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to create admin!');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });

    it('should success creating admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'insertOne').resolves({ err: null });
      const res = await main.createAdmin(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.insertOne.restore();
    });
  });

  describe('Login admin', () => {
    it('should error if super admin not found', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.loginAdmin(payloadLogin);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Admin not found!');
      qProcess.findOne.restore();
    });

    it('should fail if not an admin', async () => {
      resultDetail.data.roles = ROLES.USER;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.loginAdmin(payloadLogin);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'Account is not an admin!');
      qProcess.findOne.restore();
    });

    it('should error if wrong password', async () => {
      payloadLogin.password = null;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.loginAdmin(payloadLogin);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.BAD_REQUEST);
      assert.equal(res.message, 'Password incorrect!');
      qProcess.findOne.restore();
    });

    // it('should success login admin', async () => {
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
    //   const res = await main.loginAdmin(payloadLogin);
    //   assert.deepEqual(res.err, null);
    //   assert.deepEqual(res.data, resultDetail.data);
    //   assert.deepEqual(res.code, CODE.SUCCESS);
    //   assert.deepEqual(res.message, 'Logged in');
    //   qProcess.findOne.restore();
    //   jwtAuth.generateToken.restore();
    //   client.setExpire.restore();
    // });
  });

  describe('Update admin', () => {
    it('should fail if access update is not an admin', async () => {
      payload.opts.roles = ROLES.USER;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.updateAdmin(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not an admin!');
      qProcess.findOne.restore();
    });

    it('should error finding admin before update', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.updateAdmin(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Admin not found!');
      qProcess.findOne.restore();
    });

    it('should fail updating admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: true });
      const res = await main.updateAdmin(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to update admin!');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });

    it('should success updating admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'updateOne').resolves({ err: null });
      const res = await main.updateAdmin(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.updateOne.restore();
    });
  });

  describe('Delete admin', () => {
    it('should fail if access delete is not an admin', async () => {
      payload.opts.roles = ROLES.USER;
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.deleteAdmin(payload);
      assert.deepEqual(res.err, 'fail');
      assert.deepEqual(res.code, CODE.UNAUTHORIZED);
      assert.deepEqual(res.message, 'This account is not an admin!');
      qProcess.findOne.restore();
    });

    it('should error finding admin before delete', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.deleteAdmin(payload);
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Admin not found!');
      qProcess.findOne.restore();
    });

    it('should fail deleting admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: true });
      const res = await main.deleteAdmin(payload);
      assert.equal(res.err, 'fail');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Failed to delete admin!');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });

    it('should success deleting admin', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: null });
      sinon.stub(process, 'deleteOne').resolves({ err: null });
      const res = await main.deleteAdmin(payload);
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
      process.deleteOne.restore();
    });
  });
});

