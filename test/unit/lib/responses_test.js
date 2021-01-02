const { expect } = require('chai');

const { sendResponse } = require('../../../app/lib/responses');

describe('Unit responses', () => {
	it('expected function', () => {
		expect(sendResponse).to.be.a('function');
	});
});
