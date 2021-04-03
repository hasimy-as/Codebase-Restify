const sinon = require('sinon');
const redis = require('redis');

const config = require('../../../../app/config/config');
const connectRedis = require('../../../../app/database/redis/connect');

describe('Redis server', () => {
  it('should create redis pool connection', async () => {
    sinon.stub(redis, 'createClient').resolves(config.get('/redis'));
    connectRedis.myPool();
    redis.createClient.restore();
  });
});
