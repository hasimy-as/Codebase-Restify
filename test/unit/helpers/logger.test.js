const sinon = require('sinon');
const winston = require('winston');

const logger = require('../../../app/helpers/logger');

describe('Logger', () => {
  beforeEach(() => {
    sinon.stub(winston, 'Logger').resolves({ info: sinon.stub() });
  });

  afterEach(() => {
    winston.Logger.restore();
  });

  it('should send log info', () => {
    logger.info('Logger', 'Connected!', 'Logger-info');
  });
  it('should send log error', () => {
    logger.error('Logger', 'Disconnected!', 'Logger-error');
  });
});
