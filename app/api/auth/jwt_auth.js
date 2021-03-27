const jwt = require('jsonwebtoken');
const fs = require('fs');

const env = require('../../config/config');
const wrapper = require('../../helpers/wrapper');
const { CODE } = require('../../lib/http_code');

const getKey = (keyPath) => fs.readFileSync(keyPath, 'utf8');
const verifyOptions = {
  algorithm: 'RS256',
  issuer: 'hasimy-as',
  expiresIn: '24h',
};

const generateToken = async (payload) => {
  const privateKey = getKey(env.get('/privateKey'));
  const token = jwt.sign(payload, privateKey, verifyOptions);
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
  const publicKey = fs.readFileSync(env.get('/publicKey'), 'utf8');
  delete verifyOptions.expiresIn;

  const token = getToken(req.headers);
  if (!token) {
    return wrapper.response(res, 'fail', result, 'Invalid token!', CODE.FORBIDDEN);
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, publicKey, verifyOptions);
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