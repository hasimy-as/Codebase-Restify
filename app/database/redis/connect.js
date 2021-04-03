const redis = require('redis');
const genericPool = require('generic-pool');
const config = require('../../config/config');

const myPool = () =>
  genericPool.createPool({
    create: function () {
      return redis.createClient(config.get('/redis'));
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
