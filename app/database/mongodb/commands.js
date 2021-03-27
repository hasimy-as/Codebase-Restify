const validate = require('validate.js');

const mongoConnect = require('./connect');
const wrapper = require('../../helpers/wrapper');
const logger = require('../../helpers/logger');

const { CODE } = require('../../lib/http_code');

class Commands {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.split('/').pop();
    const dbName = validate.isEmpty(this.dbName) ? config : this.dbName;
    return dbName;
  }

  async insertOne(document) {
    const ctx = 'Mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const record = await db.insertOne(document);
      if (record.result.n !== 1) {
        logger.error(ctx, CODE.BAD_REQUEST, 'Database error');
        return wrapper.error('Failed to insert data');
      }
      return wrapper.data(document);
    } catch (err) {
      logger.error(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(`Insert One => ${err.message}`);
    }
  }

  async findMany(params) {
    const ctx = 'Mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const record = await db.find(params).toArray();
      if (validate.isEmpty(record)) {
        return wrapper.error('Data not found', CODE.NOT_FOUND);
      }
      return wrapper.data(record);
    } catch (err) {
      logger.error(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Find Many => ${err.message}`);
    }
  }

  async findOne(params) {
    const ctx = 'Mongodb-findOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const record = await db.findOne(params);
      if (validate.isEmpty(record)) {
        return wrapper.error('Data not found', CODE.NOT_FOUND);
      }
      return wrapper.data(record);
    } catch (err) {
      logger.error(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(`Find One => ${err.message}`);
    }
  }

  async updateOne(params, query) {
    const ctx = 'Mongodb-updateOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
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
      logger.error(ctx, err.message, 'Error update data in mongodb');
      return wrapper.error(`Update One => ${err.message}`);
    }
  }

  async deleteOne(params) {
    const ctx = 'Mongodb-deleteOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const record = await db.deleteOne(params);
      if (validate.isEmpty(record)) {
        return wrapper.error('Data not found', CODE.NOT_FOUND);
      }
      return wrapper.data(record);
    } catch (err) {
      logger.error(err.message, 'Error delete data in mongodb');
      return wrapper.error(`Delete One => ${err.message}`);
    }
  }

  async aggregate(parameter) {
    const ctx = 'Mongodb-aggregate';
    const dbName = await this.getDatabase();
    const result = await mongoConnect.getConnection(this.config);
    if (result.err) {
      logger.error(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const record = await db.aggregate(parameter, { collation: { locale: 'en' } }).toArray();
      if (validate.isEmpty(record)) {
        return wrapper.error('Data not found', CODE.NOT_FOUND);
      }
      return wrapper.data(record);

    } catch (err) {
      logger.error(ctx, err.message, 'Error find and aggregate data in mongodb');
      return wrapper.error(`Aggregate => ${err.message}`);
    }
  }
}

module.exports = Commands;
