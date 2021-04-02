const collection = 'admin';

class Command {
  constructor(db) {
    this.db = db;
  }

  async insertOne(payload) {
    this.db.setCollection(collection);
    return this.db.insertOne(payload);
  }

  async updateOne(params, payload) {
    this.db.setCollection(collection);
    return this.db.updateOne(params, payload);
  }

  async deleteOne(params, payload) {
    this.db.setCollection(collection);
    return this.db.deleteOne(params, payload);
  }
}

module.exports = Command;
