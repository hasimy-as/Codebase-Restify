const { expect } = require('chai');

const { sendResponse } = require('../../../app/helpers/response');

describe('Unit responses', () => {
  it('expected function', () => {
    expect(sendResponse).to.be.a('function');
  });
});
