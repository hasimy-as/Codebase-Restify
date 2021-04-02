const sinon = require('sinon');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/user/depository/process/main');
const handler = require('../../../../../../../app/api/components/user/depository/process/handler');

describe('User processHandler', async () => {
  let resultDetail;
  let main = Main.prototype;

  resultDetail = {
    err: null,
    message: '',
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
    code: CODE.SUCCESS
  };

  it('should success inserting a user', async () => {
    sinon.stub(main, 'createUser').resolves(resultDetail);
    await handler.createUser();
    main.createUser.restore();
  });

  it('should success login user', async () => {
    sinon.stub(main, 'loginUser').resolves(resultDetail);
    await handler.loginUser();
    main.loginUser.restore();
  });

  it('should success updating a user', async () => {
    sinon.stub(main, 'updateUser').resolves(resultDetail);
    await handler.updateUser();
    main.updateUser.restore();
  });

  it('should success deleting a user', async () => {
    sinon.stub(main, 'deleteUser').resolves(resultDetail);
    await handler.deleteUser();
    main.deleteUser.restore();
  });
});
