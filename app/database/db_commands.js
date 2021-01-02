const validate = require('validate.js');

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
		const env = this.env.split('/').pop();
		const dbName = validate.isEmpty(this.dbName) ? env : this.dbName;
		return dbName;
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
			const record = await db.insertOne(document);
			if (record.result.n !== 1) {
				logger.log(ctx, CODE.BAD_REQUEST, 'Database error');
				return wrapper.error('Failed to insert data');
			}
			return wrapper.data(document);
		} catch (err) {
			logger.log(ctx, err.message, 'Error insert data in mongodb');
			return wrapper.error(`Insert One => ${err.message}`);
		}
	}

	async findMany(params) {
		const ctx = 'mongodb-findMany';
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
			const record = await db.find(params).toArray();
			if (validate.isEmpty(record)) {
				logger.log(ctx, CODE.BAD_REQUEST, 'Database error');
				return wrapper.error('Data not found', CODE.NOT_FOUND);
			}
			return wrapper.data(record);
		} catch (err) {
			logger.log(ctx, err.message, 'Error find data in mongodb');
			return wrapper.error(`Find Many => ${err.message}`);
		}
	}

	async findOne(params) {
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
			const record = await db.findOne(params);
			if (validate.isEmpty(record)) {
				logger.log(ctx, CODE.BAD_REQUEST, 'Database error');
				return wrapper.error('Data not found', CODE.NOT_FOUND);
			}
			return wrapper.data(record);
		} catch (err) {
			logger.log(ctx, err.message, 'Error find data in mongodb');
			return wrapper.error(`Find One => ${err.message}`);
		}
	}

	async updateOne(params, query) {
		const ctx = 'mongodb-updateOne';
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
			const data = await db.updateOne(params, query, {
				upsert: true,
			});
			if (data.result.nModified >= 0) {
				const {
					result: { nModified },
				} = data;
				const record = await this.findOne(params);
				if (nModified === 0) {
					return wrapper.data(record.data);
				}
				return wrapper.data(record.data);
			}
			return wrapper.error('Failed update data');
		} catch (err) {
			logger.log(ctx, err.message, 'Error update data in mongodb');
			return wrapper.error(`Update One => ${err.message}`);
		}
	}

	async deleteOne(params) {
		const ctx = 'mongodb-deleteOne';
		const dbName = await this.getDatabase();
		const result = await mongoConnect.getConnection(this.env);
		if (result.err) {
			logger.log(result.err.message, 'Error mongodb connection');
			return result;
		}
		try {
			const cacheConnection = result.data.db;
			const connection = cacheConnection.db(dbName);
			const db = connection.collection(this.collectionName);
			const record = await db.deleteOne(params);
			if (validate.isEmpty(record)) {
				logger.log(ctx, CODE.BAD_REQUEST, 'Database error');
				return wrapper.error('Data not found', CODE.NOT_FOUND);
			}
			return wrapper.data(record);
		} catch (err) {
			logger.log(err.message, 'Error delete data in mongodb');
			return wrapper.error(`Delete One => ${err.message}`);
		}
	}
}

module.exports = DatabaseCommands;
