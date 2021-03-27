const redis = require('redis');
const genericPool = require('generic-pool');
const config = require('../../config/config');
const redisUrl = config.get('/');

const myPool = () =>
  genericPool.createPool({
    create: function () {
      return redis.createClient({
        port: redisUrl.redis.port,
        host: redisUrl.redis.host,
        password: redisUrl.redis.password
      });
    },
    destroy: function (client) {
      client.quit();
    }
  }, {
    max: 10,
    min: 2,
    idleTimeoutMillis: 1000
  });


module.exports = {
  myPool
};
