const sinon = require('sinon');
const redis = require('redis');

const config = require('../../../../app/config/config');
const connectRedis = require('../../../../app/database/redis/connect');

const redisUrl = config.get('/');

describe('Redis server', () => {
  it('should create redis pool connection', async () => {
    sinon.stub(redis, 'createClient').resolves({
      port: redisUrl.redis.port,
      host: redisUrl.redis.host,
      password: redisUrl.redis.password
    });
    connectRedis.myPool();
    redis.createClient.restore();
  });
});
