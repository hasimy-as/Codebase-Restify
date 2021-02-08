require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  mongo: process.env.MONGO_URI,
  basicAuth: [
    {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
    }
  ],
  secretKey: process.env.SECRET_KEY,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
