const sinon = require('sinon');

const { CODE } = require('../../../../../../../app/lib/http_code');

const Main = require('../../../../../../../app/api/components/user/depository/inquiry/main');
const handler = require('../../../../../../../app/api/components/user/depository/inquiry/handler');

describe('User inquiryHandler', async () => {
  let resultAll;
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
        userId: 'eeef1f1d-190e-456b-8b11-72449d08f551',
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

  it('should success get all users', async () => {
    sinon.stub(main, 'getUsers').resolves(resultAll);
    await handler.getUsers();
    main.getUsers.restore();
  });

  it('should success get user by userId', async () => {
    sinon.stub(main, 'getUserById').resolves(resultDetail);
    await handler.getUserById();
    main.getUserById.restore();
  });
});
