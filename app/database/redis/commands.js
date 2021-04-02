const wrapper = require('../../helpers/wrapper');
const { CODE } = require('../../lib/http_code');

const getConnection = require('./connect');

class Redis {

  constructor(config) {
    this.config = config;
  }

  async setExpire(key, value, expireType, expire) {
    let client = await getConnection.myPool().acquire();
    client.on('error', (err) => {
      return wrapper.error(err, 'Failed to set data on Redis');
    });

    client.set(key, JSON.stringify(value), expireType, expire);
    return wrapper.data('', 'Successfully set data on Redis', 200);
  }

  async get(key) {
    let client = await getConnection.myPool().acquire();
    client.on('error', (err) => {
      if (err === 'ECONNREFUSED') {
        return wrapper.error(err, 'Failed to get data from Redis');
      }
      return wrapper.error(err, 'Failed to get data from Redis');
    });
    return new Promise(((resolve, reject) => {
      client.get(key, (err, replies) => {
        if (err !== null) {
          reject(wrapper.error(err, 'Data not found', CODE.NOT_FOUND));
        }
        resolve(wrapper.data(replies));
      });
    }));
  }

  async del(key) {
    let client = await getConnection.myPool().acquire();
    client.on('error', (err) => {
      return wrapper.error(err, 'Failed to set data on Redis');
    });
    client.del(key);
    return wrapper.data('', 'Success deleting data on Redis', CODE.SUCCESS);
  }

  async incr(key) {
    let client = await getConnection.myPool().acquire();
    client.on('error', (err) => {
      if (err === 'ECONNREFUSED') {
        return wrapper.error(err, 'Failed to increment data from Redis');
      }
      return wrapper.error(err, 'Failed to increment data from Redis');
    });
    return new Promise(((resolve, reject) => {
      client.incr(key, (err, replies) => {
        if (err !== null) {
          reject(wrapper.error(err, 'Failed to increment data from Redis', CODE.INTERNAL_ERROR));
        }
        resolve(wrapper.data(replies));
      });
    }));
  }
}

module.exports = Redis;
