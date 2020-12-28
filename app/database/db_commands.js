const mongoConnect = require('./db');
const wrapper = require('../lib/wrapper');
const logger = require('../lib/logger');

const { CODE } = require('../lib/http_code');

class DatabaseCommands {
	constructor(env) {
		this.env = env;
	}

	setCollection(collectionName) {
		this.collectionName = collectionName;
	}

	async getDatabase() {
		const env = this.env.replace('//', '');
		const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
		const dbName = pattern.exec(env);
		return dbName[1];
	}

	async insertOne(document) {
		const ctx = 'mongodb-insertOne';
		const dbName = await this.getDatabase();
		const result = await mongoConnect.getConnection(this.env);
		if (result.err) {
			logger.log(ctx, result.err.message, 'Error mongodb connection');
			return result;
		}
		try {
			const cacheConnection = result.data.db;
			const connection = cacheConnection.db(dbName);
			const db = connection.collection(this.collectionName);
			const recordset = await db.insertOne(document);
			if (recordset.result.n !== 1) {
				return wrapper.error('Failed Inserting Data to Database');
			}
			return wrapper.data(document);
		} catch (err) {
			logger.log(ctx, err.message, 'Error insert data in mongodb');
			return wrapper.error(`Insert One => ${err.message}`);
		}
	}

	async findOne(parameter) {
		const ctx = 'mongodb-findOne';
		const dbName = await this.getDatabase();
		const result = await mongoConnect.getConnection(this.env);
		if (result.err) {
			logger.log(ctx, result.err.message, 'Error mongodb connection');
			return result;
		}
		try {
			const cacheConnection = result.data.db;
			const connection = cacheConnection.db(dbName);
			const db = connection.collection(this.collectionName);
			const recordset = await db.findOne(parameter);
			if (!!recordset) {
				return wrapper.error(
					'Data Not Found',
					'Please Try Another Input',
					CODE.NOT_FOUND,
				);
			}
			return wrapper.data(recordset);
		} catch (err) {
			logger.log(ctx, err.message, 'Error find data in mongodb');
			return wrapper.error(
				`Find One => ${err.message}`,
				`${err.message}`,
				CODE.CONFLICT,
			);
		}
	}
}

module.exports = DatabaseCommands;
