const sinon = require('sinon');
const assert = require('assert');

const { CODE } = require('../../../../../../../app/lib/http_code');

const main = require('../../../../../../../app/api/components/user/api_depository/request/main');
const request = require('../../../../../../../app/api/components/user/api_depository/request/request');
const response = require('../../../../../../../app/api/components/user/api_depository/response/response');

const user = new main();

describe('Unit user main request', () => {
	let payload, resultUser, resultDelete;

	payload = {
		userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
		name: 'Hasimy',
		address: 'Indonesia',
	};

	resultUser = {
		err: null,
		message: '',
		data: {
			userId: 'e720b030-c441-4560-bb23-b88a60d2a1c1',
			name: 'Hasimy',
			address: 'Indonesia',
		},
		code: CODE.SUCCESS,
	};

	resultDelete = {
		err: null,
		message: '',
		data: null,
		code: CODE.SUCCESS,
	};

	describe('Create user', () => {
		it('should fail to create user', async () => {
			sinon.stub(request, 'insertOne').resolves({ err: true });
			const res = await user.createUser(payload);
			assert.equal(res.err, 'fail');
			assert.equal(res.code, CODE.INTERNAL_ERROR);
			assert.equal(res.message, 'Failed to create user');

			request.insertOne.restore();
		});
		it('should success to create user', async () => {
			sinon.stub(request, 'insertOne').resolves(resultUser);
			const res = await user.createUser(payload);
			assert.equal(res.err, null);
			assert.equal(res.code, CODE.SUCCESS);
			assert.equal(res.message, '');

			request.insertOne.restore();
		});
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
			const res = await user.updateUser(req);
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
