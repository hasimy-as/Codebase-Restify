const collection = 'user';

class Query {
  constructor(db) {
    this.db = db;
  }

  async findMany(payload) {
    this.db.setCollection(collection);
    return this.db.findMany(payload);
  }

  async findOne(payload) {
    this.db.setCollection(collection);
    return this.db.findOne(payload);
  }
}

module.exports = Query;
