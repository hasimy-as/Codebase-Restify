const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/admin/depository/inquiry/main');
const Query = require('../../../../../../../app/api/components/admin/depository/inquiry/query');

const qProcess = Query.prototype;
const main = new Main();

describe('Admin inquiryMain', () => {
  let resultDetail, resultAll;
  beforeEach(() => {
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

    resultAll = {
      err: null,
      message: '',
      data: [
        {
          adminId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
          name: 'Hasimy Md',
          address: ' Indonesia',
          phone: '081234567890',
          email: 'api-test@aol.com',
          password: '82eb8fe681ee2a0769151290e6181d3f',
          roles: '1',
          createdAt: '2021-03-25T16:43:09.119Z',
          _id: '605cbd9d0f072e73d9d58274'
        }
      ],
      code: CODE.SUCCESS
    };
  });

  describe('Get admins', () => {
    it('should get all admins', async () => {
      sinon.stub(qProcess, 'findMany').resolves(resultAll);
      const res = await main.getAdmins();
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findMany.restore();
    });

    it('should error get all admins', async () => {
      sinon.stub(qProcess, 'findMany').resolves({ err: true });
      const res = await main.getAdmins();
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.INTERNAL_ERROR);
      assert.equal(res.message, 'Cannot get all admins!');
      qProcess.findMany.restore();
    });
  });

  describe('Get admin by adminId', () => {
    it('should get admin by adminId', async () => {
      sinon.stub(qProcess, 'findOne').resolves(resultDetail);
      const res = await main.getAdminById({ adminId: 'eeef1f1d-190e-456b-8b11-72449d08f551' });
      assert.equal(res.err, null);
      assert.equal(res.code, CODE.SUCCESS);
      assert.equal(res.message, '');
      qProcess.findOne.restore();
    });

    it('should error get admin by adminId', async () => {
      sinon.stub(qProcess, 'findOne').resolves({ err: true });
      const res = await main.getAdminById({ adminId: 'eeef1f1d-190e-456b-8b11-72449d08f551' });
      assert.equal(res.err, 'error');
      assert.equal(res.code, CODE.NOT_FOUND);
      assert.equal(res.message, 'Admin not found!');
      qProcess.findOne.restore();
    });
  });
});

