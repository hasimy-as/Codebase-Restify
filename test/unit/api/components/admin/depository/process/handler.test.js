const sinon = require('sinon');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/admin/depository/process/main');
const handler = require('../../../../../../../app/api/components/admin/depository/process/handler');

describe('Admin processHandler', async () => {
  let resultDetail;
  let main = Main.prototype;

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

  it('should success inserting an admin', async () => {
    sinon.stub(main, 'createAdmin').resolves(resultDetail);
    await handler.createAdmin();
    main.createAdmin.restore();
  });

  it('should success login admin', async () => {
    sinon.stub(main, 'loginAdmin').resolves(resultDetail);
    await handler.loginAdmin();
    main.loginAdmin.restore();
  });

  it('should success updating an admin', async () => {
    sinon.stub(main, 'updateAdmin').resolves(resultDetail);
    await handler.updateAdmin();
    main.updateAdmin.restore();
  });

  it('should success deleting an admin', async () => {
    sinon.stub(main, 'deleteAdmin').resolves(resultDetail);
    await handler.deleteAdmin();
    main.deleteAdmin.restore();
  });
});
