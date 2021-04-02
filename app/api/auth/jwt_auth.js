const fs = require('fs');
const jwt = require('jsonwebtoken');
const validate = require('validate.js');

const config = require('../../config/config');
const wrapper = require('../../helpers/wrapper');
const Redis = require('../../database/redis/commands');
const { CODE } = require('../../lib/http_code');

const client = new Redis();

const getKey = (keyPath) => fs.readFileSync(keyPath, 'utf8');

const generateToken = async (payload) => {
  const privateKey = getKey(config.get('/privateKey'));
  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    issuer: 'hasimy-as',
    expiresIn: '24h',
  });
  return token;
};

const getToken = (headers) => {
  if (headers && headers.authorization && headers.authorization.includes('Bearer')) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

const verifyToken = async (req, res, next) => {
  const result = {
    data: null,
  };
  const publicKey = fs.readFileSync(config.get('/publicKey'), 'utf8');

  const token = getToken(req.headers);
  if (!token) {
    return wrapper.response(res, 'fail', result, 'Invalid token!', CODE.FORBIDDEN);
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, publicKey, { algorithm: 'RS256' });
    const { data: redis, err: redisErr } = await client.get(`${decodedToken.key}${decodedToken._id}`);
    if (redisErr || validate.isEmpty(redis)) {
      return wrapper.response(res, 'fail', result, 'Access token expired!', CODE.UNAUTHORIZED);
    }
    decodedToken = JSON.parse(redis);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.response(res, 'fail', result, 'Access token expired!', CODE.UNAUTHORIZED);
    }
    return wrapper.response(res, 'fail', result, 'Token is not valid!', CODE.UNAUTHORIZED);
  }

  const opts = {
    ...decodedToken,
    authorization: req.headers.authorization
  };

  req.opts = opts;
  next();
};

module.exports = {
  generateToken,
  verifyToken,
};
