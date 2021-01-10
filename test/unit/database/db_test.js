const sinon = require('sinon');
const { expect } = require('chai');
const mongodb = require('mongodb').MongoClient;

const mongoConnect = require('../../../app/database/db');
const logger = require('../../../app/lib/logger');
const env = require('../../../app/config/config');

describe('Unit database', () => {
  it('should fail to create connection', async () => {
    sinon.stub(mongodb, 'connect')
      .resolves({
        isConnected: sinon.stub().returns(true),
      })
      .rejects({ message: 'Error connection' });
    sinon.stub(logger, 'log');

    mongoConnect.init();

    mongodb.connect.restore();
    logger.log.restore();
  });

  it('should fail to create connection with available mongo url', async () => {
    sinon.stub(mongodb, 'connect')
      .resolves({
        isConnected: sinon.stub().returns(true),
      })
      .rejects({ message: 'Error connection' });
    sinon.stub(logger, 'log');

    mongoConnect.getConnection(env.get('/mongo'));

    mongodb.connect.restore();
    logger.log.restore();
  });

  it('should create connection', async () => {
    sinon.stub(mongodb, 'connect').resolves({
      isConnected: sinon.stub().returns(true),
    });
    sinon.stub(logger, 'log');

    mongoConnect.init();

    mongodb.connect.restore();
    logger.log.restore();
  });

  it('should get connection', async () => {
    sinon.stub(mongodb, 'connect').resolves({
      isConnected: sinon.stub().returns(true),
    });
    sinon.stub(logger, 'log');

    expect(await mongoConnect.getConnection(env.get('/mongo')))
      .to.haveOwnProperty('data')
      .to.be.an('object');

    let result = await mongoConnect.getConnection(env.get('/mongo'));

    expect(result.data).to.has.all.keys(['index', 'db', 'env']);
    expect(result.data.db).to.be.not.empty;
    expect(result.data.env).to.equals(env.get('/mongo'));

    mongodb.connect.restore();
    logger.log.restore();
  });
});
