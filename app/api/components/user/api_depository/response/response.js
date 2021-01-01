/**
 * @description 
 * In Development
 */

const mongodb = require('../../../../../database/db_commands');
const env = require('../../../../../config/config');
const collection = 'user';

const findMany = async (payload) => {
	const db = new mongodb(env.get('/mongo'));
	db.setCollection(collection);
	return db.findMany(payload);
};

const findOne = async (payload) => {
	const db = new mongodb(env.get('/mongo'));
	db.setCollection(collection);
	return db.findOne(payload);
};

module.exports = {
	findMany,
};
