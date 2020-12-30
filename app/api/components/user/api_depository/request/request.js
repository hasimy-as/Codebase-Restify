/**
 * @description 
 * In Development
 */

const mongodb = require('../../../../../database/db_commands');
const env = require('../../../../../config/config');
const collection = 'user';

const insertOne = async (payload) => {
  const db = new mongodb(env.get('/mongo'));
  db.setCollection(collection);
  return db.insertOne(payload);
}

module.exports = {
  insertOne
}