const mongodb = require('mongodb').MongoClient;
const validate = require('validate.js');

const { CODE } = require('../lib/http_code');
const logger = require('../lib/logger');
const wrapper = require('../lib/wrapper');
const env = require('../config/config');

const ctx = 'db-connection';
const connPool = [];
const conn = () => {
	const connState = { index: 0, env: '', db: null };
	return connState;
};

const createConnection = async (env) => {
	const options = {
		poolSize: 50,
		keepAlive: 5000,
		socketTimeoutMS: 5000,
		connectTimeoutMS: 5000,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		const mongoConnect = await mongodb.connect(env, options);
		logger.log(ctx, 'database running', 'connected!');
		return wrapper.data(mongoConnect);
	} catch (err) {
		logger.log(ctx, err, 'error!');
		wrapper.error(err, err.message, CODE.SERVICE_UNAVAILABLE);
	}
};

const addConnectionPool = () => {
	const connection = conn();
	connection.env = env.get('/mongo');
	return connPool.push(connection);
};

const createConnectionPool = async () => {
	connPool.map(async (currentConnection, index) => {
		const result = await createConnection(currentConnection.env);
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

const isExistConnection = async (env) => {
	let state = {};
	connPool.map((currentConnection) => {
		if (currentConnection.env === env) {
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

const getConnection = async (env) => {
	let connectionIndex;
	const checkConnection = async () => {
		const result = await isExistConnection(env);
		if (result.err) {
			return result;
		}
		const connection = await isConnected(result.data);
		connectionIndex = result.data.index;
		return connection;
	};

	const result = await checkConnection();
	if (result.err) {
		const state = await createConnection(env);
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
