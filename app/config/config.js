/**
 * @description 
 * In Development
 */

require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  mongo: process.env.MONGO_URI
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
