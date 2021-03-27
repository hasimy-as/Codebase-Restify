const mongodb = require('mongodb').MongoClient;
const validate = require('validate.js');

const { CODE } = require('../../lib/http_code');
const logger = require('../../helpers/logger');
const wrapper = require('../../helpers/wrapper');
const config = require('../../config/config');

const ctx = 'Db-connection';
const connPool = [];
const conn = () => {
  const connState = { index: 0, config: '', db: null };
  return connState;
};

const createConnection = async (config) => {
  const options = {
    poolSize: 50,
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    const mongoConnect = await mongodb.connect(config, options);
    logger.info(ctx, 'Database running', 'Connected!');
    return wrapper.data(mongoConnect);
  } catch (err) {
    logger.error(ctx, err, 'Error!');
    wrapper.error(err, err.message, CODE.SERVICE_UNAVAILABLE);
  }
};

const addConnectionPool = () => {
  const connection = conn();
  connection.config = config.get('/mongo');
  return connPool.push(connection);
};

const createConnectionPool = async () => {
  connPool.map(async (currentConnection, index) => {
    const result = await createConnection(currentConnection.config);
    if (result.err) {
      connPool[index].db = currentConnection;
    } else {
      connPool[index].db = result.data;
    }
  });
};

const init = () => {
  addConnectionPool();
  createConnectionPool();
};

const isExistConnection = async (config) => {
  let state = {};
  connPool.map((currentConnection) => {
    if (currentConnection.config === config) {
      state = currentConnection;
    }
    return state;
  });
  if (validate.isEmpty(state))
    wrapper.error(
      'Error connection',
      'Connection must be created',
      CODE.NOT_FOUND,
    );

  return wrapper.data(state);
};

const isConnected = async (state) => {
  const connection = state.db;
  if (!connection.isConnected()) {
    wrapper.error(
      'Error connection',
      'Connection must be created',
      CODE.NOT_FOUND,
      state,
    );
  }
  return wrapper.data(state);
};

const getConnection = async (config) => {
  let connectionIndex;
  const checkConnection = async () => {
    const result = await isExistConnection(config);
    if (result.err) {
      return result;
    }
    const connection = await isConnected(result.data);
    connectionIndex = result.data.index;
    return connection;
  };

  const result = await checkConnection();
  if (result.err) {
    const state = await createConnection(config);
    if (state.err) {
      wrapper.data(connPool[connectionIndex]);
    }
    connPool[connectionIndex].db = state.data;
    return wrapper.data(connPool[connectionIndex]);
  }
  return result;
};

module.exports = {
  init,
  getConnection,
};
