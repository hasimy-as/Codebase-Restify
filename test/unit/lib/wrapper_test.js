const { expect } = require('chai');

const { CODE } = require('../../../app/lib/http_code');
const { data, error, response } = require('../../../app/lib/wrapper');

describe('Unit wrapper', () => {
	describe('Wrapper data', () => {
		it('expected function', () => {
			expect(data).to.be.a('function');
		});

		it('expected to return data', async () => {
			expect(data('data')).to.be.a('object').haveOwnProperty('data');
		});
	});

	describe('Wrapper error', () => {
		it('expected function', () => {
			expect(error).to.be.a('function');
		});

		it('expected to return error', async () => {
			expect(error('fail', 'fail'))
				.to.be.a('object')
				.haveOwnProperty('code')
				.equal(CODE.INTERNAL_ERROR);
		});
	});

	describe('Wrapper response', () => {
		it('expected function', () => {
			expect(response).to.be.a('function');
		});

		it('expected send datas', async () => {
			const res = {
				send: function () {
					return true;
				},
			};
			response(res, 'success', { data: true, message: 'ok' });
			response(
				res,
				'success',
				{ data: true, message: 'ok' },
				'message',
				CODE.SUCCESS,
			);
			response(res, 'fail', {}, 'message', CODE.SUCCESS);
			response(res, 'default', {}, 'message', CODE.SUCCESS);
		});
	});
});
