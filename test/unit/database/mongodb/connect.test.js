const sinon = require('sinon');
const { expect } = require('chai');
const mongodb = require('mongodb').MongoClient;

const mongoConnect = require('../../../../app/database/mongodb/connect');
const logger = require('../../../../app/helpers/logger');
const config = require('../../../../app/config/config');

describe('Mongodb database', () => {
  it('should fail to create connection', async () => {
    sinon.stub(mongodb, 'connect')
      .resolves({
        isConnected: sinon.stub().returns(true),
      })
      .rejects({ message: 'Error connection' });
    sinon.stub(logger, 'error');

    mongoConnect.init();

    mongodb.connect.restore();
    logger.error.restore();
  });

  it('should fail to create connection with available mongo url', async () => {
    sinon.stub(mongodb, 'connect')
      .resolves({
        isConnected: sinon.stub().returns(true),
      })
      .rejects({ message: 'Error connection' });
    sinon.stub(logger, 'error');

    mongoConnect.getConnection(config.get('/mongo'));

    mongodb.connect.restore();
    logger.error.restore();
  });

  it('should create connection', async () => {
    sinon.stub(mongodb, 'connect').resolves({
      isConnected: sinon.stub().returns(true),
    });
    sinon.stub(logger, 'error');

    mongoConnect.init();

    mongodb.connect.restore();
    logger.error.restore();
  });

  it('should get connection', async () => {
    sinon.stub(mongodb, 'connect').resolves({
      isConnected: sinon.stub().returns(true),
    });
    sinon.stub(logger, 'error');

    expect(await mongoConnect.getConnection(config.get('/mongo')))
      .to.haveOwnProperty('data')
      .to.be.an('object');

    let result = await mongoConnect.getConnection(config.get('/mongo'));

    expect(result.data).to.has.all.keys(['index', 'db', 'config']);
    expect(result.data.db).to.be.not.empty;
    expect(result.data.config).to.equals(config.get('/mongo'));

    mongodb.connect.restore();
    logger.error.restore();
  });
});
