const mongodb = require('../../../../../database/db_commands');
const env = require('../../../../../config/config');
const collection = 'user';

const insertOne = async (payload) => {
  const db = new mongodb(env.get('/mongo'));
  db.setCollection(collection);
  return db.insertOne(payload);
};

const updateOne = async (params, payload) => {
  const db = new mongodb(env.get('/mongo'));
  db.setCollection(collection);
  return db.updateOne(params, payload);
};

const deleteOne = async (params, payload) => {
  const db = new mongodb(env.get('/mongo'));
  db.setCollection(collection);
  return db.deleteOne(params, payload);
};

module.exports = {
  insertOne,
  updateOne,
  deleteOne,
};
