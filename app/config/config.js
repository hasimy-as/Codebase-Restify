require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
