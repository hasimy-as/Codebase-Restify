const mongodb = require('mongodb').MongoClient;

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
	};
	try {
    const mongoConnect = await mongodb.connect(env, options);
		logger.log(ctx, 'database running', 'connected!');
		wrapper.data(mongoConnect);
	} catch (err) {
		logger.log(ctx, 'database connection error', 'error!');
		wrapper.error(err, err.message, CODE.SERVICE_UNAVAILABLE);
	}
};

const addConnectionPool = () => {
	const connection = conn();
	connection.env = env.get('/mongo');
	return connPool.push(connection);
};

const createConnectionPool = async () => {
	connPool.map(async (currentConnection, index, err) => {
		const result = await createConnection(currentConnection.env);
		if (err) {
			connPool[index].db = currentConnection;
		} else if (!err) {
			connPool[index].db = result.data;
		}
	});
};

const init = () => {
	addConnectionPool();
	createConnectionPool();
};

module.exports = {
	init
};
