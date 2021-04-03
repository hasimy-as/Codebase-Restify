const sinon = require('sinon');
const { expect } = require('chai');

const { CODE } = require('../../../../../app/lib/http_code');

const operator = require('../../../../../app/api/components/admin/operator');

const inquiryHandler = require('../../../../../app/api/components/admin/depository/inquiry/handler');
const inquirySchema = require('../../../../../app/api/components/admin/depository/inquiry/schema');

const processSchema = require('../../../../../app/api/components/admin/depository/process/schema');
const processHandler = require('../../../../../app/api/components/admin/depository/process/handler');

describe('Admin operator', () => {
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
      adminId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
      name: 'Hasimy Md',
      address: ' Indonesia',
      email: 'api-test@aol.com',
      password: '82eb8fe681ee2a0769151290e6181d3f',
      roles: '1',
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
    message: 'Request Processed Completely',
    code: CODE.SUCCESS
  };

  describe('Get super admins', () => {
    it('should be a function', () => {
      expect(operator.getAdmins).to.be.a('function');
    });

    it('should success get super admin', async () => {
      sinon.stub(inquiryHandler, 'getAdmins').resolves(resultAll);
      expect(await operator.getAdmins({}, res));
      inquiryHandler.getAdmins.restore();
    });

    it('should error get super admin', async () => {
      sinon.stub(inquiryHandler, 'getAdmins').resolves({ err: true });
      expect(await operator.getAdmins({}, res));
      inquiryHandler.getAdmins.restore();
    });
  });

  describe('Get admin by adminId', () => {
    const req = {
      params: {
        adminId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901'
      }
    };

    it('should be a function', () => {
      expect(operator.getAdminById).to.be.a('function');
    });

    it('should success get admin by id', async () => {
      sinon.stub(inquiryHandler, 'getAdminById').resolves(resultDetail);
      expect(await operator.getAdminById(req, res));
      inquiryHandler.getAdminById.restore();
    });

    it('should error validate adminId schema', async () => {
      sinon.stub(inquirySchema.getAdminById, 'validateAsync').resolves({ err: true });
      expect(await operator.getAdminById(req, res));
      inquirySchema.getAdminById.validateAsync.restore();
    });
  });

  describe('Create admin', () => {
    const req = {
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.createAdmin).to.be.a('function');
    });

    it('should success to create a admin', async () => {
      sinon.stub(processHandler, 'createAdmin').resolves(resultDetail);
      expect(await operator.createAdmin(req, res));
      processHandler.createAdmin.restore();
    });

    it('should fail to validate admin schema', async () => {
      sinon.stub(processSchema.createAdmin, 'validateAsync').resolves({ err: true });
      expect(await operator.createAdmin(req, res));
      processSchema.createAdmin.validateAsync.restore();
    });

    it('should fail to create an admin', async () => {
      sinon.stub(processHandler, 'createAdmin').resolves({ err: true });
      expect(await operator.createAdmin(req, res));
      processHandler.createAdmin.restore();
    });
  });

  describe('Login super admin', () => {
    const req = {
      body: payloadLogin,
    };

    it('should be a function', () => {
      expect(operator.loginAdmin).to.be.a('function');
    });

    it('should success to login admin', async () => {
      sinon.stub(processHandler, 'loginAdmin').resolves(resultDetail);
      expect(await operator.loginAdmin(req, res));
      processHandler.loginAdmin.restore();
    });

    it('should fail validating login admin schema', async () => {
      sinon.stub(processSchema.loginAdmin, 'validateAsync').resolves({ err: true });
      expect(await operator.loginAdmin(req, res));
      processSchema.loginAdmin.validateAsync.restore();
    });

    it('should fail to login admin', async () => {
      sinon.stub(processHandler, 'loginAdmin').resolves({ err: true });
      expect(await operator.loginAdmin(req, res));
      processHandler.loginAdmin.restore();
    });
  });

  describe('Update admin by adminId', () => {
    const req = {
      params: {
        adminId: 'fff237cf-eb5c-4ff3-ae44-a8387dc88901',
      },
      body: payload,
    };

    it('should be a function', () => {
      expect(operator.updateAdmin).to.be.a('function');
    });

    it('should success to update existing admin', async () => {
      sinon.stub(processHandler, 'updateAdmin').resolves({ data: req });
      expect(await operator.updateAdmin(req, res));
      processHandler.updateAdmin.restore();
    });

    it('should fail to validate update admin schema', async () => {
      sinon.stub(processSchema.updateAdmin, 'validateAsync').resolves({ err: true });
      expect(await operator.updateAdmin(req, res));
      processSchema.updateAdmin.validateAsync.restore();
    });

    it('should fail to update existing admin', async () => {
      sinon.stub(processHandler, 'updateAdmin').resolves({ err: true });
      expect(await operator.updateAdmin(req, res));
      processHandler.updateAdmin.restore();
    });
  });

  describe('Delete admin by adminId', () => {
    const req = {
      params: {
        adminId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
      },
    };

    it('should be a function', () => {
      expect(operator.deleteAdmin).to.be.a('function');
    });

    it('should success to delete admin', async () => {
      sinon.stub(processHandler, 'deleteAdmin').resolves(resultDetail.data);
      expect(await operator.deleteAdmin(req, res));
      processHandler.deleteAdmin.restore();
    });

    it('should fail validating delete admin schema', async () => {
      sinon.stub(processSchema.deleteAdmin, 'validateAsync').resolves({ err: true });
      expect(await operator.deleteAdmin(req, res));
      processSchema.deleteAdmin.validateAsync.restore();
    });

    it('should fail to delete admin', async () => {
      sinon.stub(processHandler, 'deleteAdmin').resolves({ err: true });
      expect(await operator.deleteAdmin(req, res));
      processHandler.deleteAdmin.restore();
    });
  });
});
