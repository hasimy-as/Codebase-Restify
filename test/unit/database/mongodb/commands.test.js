const sinon = require('sinon');
const assert = require('assert');

const logger = require('../../../../app/helpers/logger');
const mongoConnect = require('../../../../app/database/mongodb/connect');
const Commands = require('../../../../app/database/mongodb/commands');

const command = Commands.prototype;

describe('Mongodb commands', () => {
  let stubDb;
  let stubConn;
  let stubGetDb;

  beforeEach(async () => {
    stubGetDb = sinon.stub(command, 'getDatabase').resolves('db');
    stubConn = sinon.stub(mongoConnect, 'getConnection').resolves({
      err: null,
      data: {
        db: {
          db: () => {
            return 'db';
          },
        },
      },
    });
    let temp = await mongoConnect.getConnection();
    stubDb = sinon.stub(temp.data.db, 'db');
  });

  describe('Db getDatabase', () => {
    it('should get database', () => {
      command.getDatabase.restore();
      const mongo = new Commands('mongodb://localhost:27017/test');
      mongo.setCollection('test');
      mongo.getDatabase();

      sinon.stub(logger, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });
  });

  describe('Db insertOne', () => {
    it('should wrapper error if get connection is error', async () => {
      stubConn.resolves({
        err: {
          message: 'error',
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.insertOne({});
      assert.equal(result.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if db function is error', async () => {
      stubConn.resolves({
        data: {
          db: {
            db: sinon.stub().callsFake(() => {
              sinon.stub().rejects(new Error('Database error'));
            }),
          },
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.insertOne({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if failed to insertOne', async () => {
      stubDb.returns({
        collection: () => {
          return {
            insertOne: sinon.stub().callsFake(() => {
              return Promise.resolve({
                result: {
                  n: 0,
                },
              });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.insertOne({});
      assert.equal(result.err, 'Failed to insert data');

      stubConn.restore();
      stubGetDb.restore();
      stubDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if success to insertOne', async () => {
      stubDb.returns({
        collection: () => {
          return {
            insertOne: sinon.stub().callsFake(() => {
              return Promise.resolve({
                result: {
                  n: 1,
                },
              });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      await command.insertOne({});

      stubConn.restore();
      stubGetDb.restore();
      stubDb.restore();
      logger.error.restore();
    });
  });

  describe('Db findMany', () => {
    it('should wrapper error if get connection is error', async () => {
      stubConn.resolves({
        err: {
          message: 'error',
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findMany({});
      assert.equal(result.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if db function is error', async () => {
      stubConn.resolves({
        data: {
          db: {
            db: sinon.stub().callsFake(() => {
              sinon.stub().rejects(new Error('Database error'));
            }),
          },
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findMany({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if failed to findMany', async () => {
      class mockFindMany {
        sort() {
          return new mockFindMany();
        }
        toArray() {
          return Promise.resolve([]);
        }
      }

      stubDb.resolves({
        collection: () => {
          return {
            find: sinon.stub().callsFake(() => {
              return new mockFindMany();
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findMany({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      stubDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if success to findMany', async () => {
      class mockFindMany {
        sort() {
          return new mockFindMany();
        }
        toArray() {
          return Promise.resolve([
            { success: true },
            { success: false },
          ]);
        }
      }

      stubDb.resolves({
        collection: () => {
          return {
            find: sinon.stub().callsFake(() => {
              return new mockFindMany();
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      await command.findMany({});

      stubConn.restore();
      stubGetDb.restore();
      stubDb.restore();
      logger.error.restore();
    });
  });

  describe('Db findOne', () => {
    it('should wrapper error if get connection error', async () => {
      stubConn.resolves({
        err: {
          message: 'error',
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findOne({});
      assert.equal(result.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if db function error', async () => {
      stubConn.resolves({
        data: {
          db: {
            db: sinon.stub().callsFake(() => {
              sinon.stub().rejects(new Error('Database error'));
            }),
          },
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findOne({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if success to findOne', async () => {
      stubDb.returns({
        collection: () => {
          return {
            findOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ success: true });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.findOne({});
      assert.equal(result.data.success, true);

      stubConn.restore();
      stubGetDb.restore();
      stubDb.restore();
      logger.error.restore();
    });
  });

  describe('Db updateOne', () => {
    it('should wrapper error if get connection error', async () => {
      stubConn.resolves({
        err: {
          message: 'error',
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.updateOne({});
      assert.equal(result.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if db function error', async () => {
      stubConn.resolves({
        data: {
          db: {
            db: sinon.stub().callsFake(() => {
              sinon.stub().rejects(new Error('Database error'));
            }),
          },
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.updateOne({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if success to insert updateOne', async () => {
      sinon.stub(command, 'findOne').resolves({
        data: 'data',
      });
      stubDb.returns({
        collection: () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({
                result: {
                  nModified: 0,
                },
              });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const res = await command.updateOne({ data: 'data' });
      assert.equal(res.data, 'data');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
      stubDb.restore();
      command.findOne.restore();
    });

    it('should wrapper data if success to updateOne', async () => {
      sinon.stub(command, 'findOne').resolves({
        data: 'data',
      });
      stubDb.returns({
        collection: () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({
                result: {
                  nModified: 1,
                },
              });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const res = await command.updateOne({ data: 'data' });
      assert.equal(res.data, 'data');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
      stubDb.restore();
      command.findOne.restore();
    });

    it('should wrapper data if failed to updateOne', async () => {
      sinon.stub(command, 'findOne').resolves({
        data: 'data',
      });
      stubDb.returns({
        collection: () => {
          return {
            updateOne: sinon.stub().callsFake(() => {
              return Promise.resolve({
                result: {
                  nModified: -1,
                },
              });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const res = await command.updateOne({ data: 'data' });
      assert.equal(res.err, 'Failed update data');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
      stubDb.restore();
      command.findOne.restore();
    });
  });

  describe('Db deleteOne', () => {
    it('should wrapper error if get connection error', async () => {
      stubConn.resolves({
        err: {
          message: 'error',
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.deleteOne({});
      assert.equal(result.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper error if db function error', async () => {
      stubConn.resolves({
        data: {
          db: {
            db: sinon.stub().callsFake(() => {
              sinon.stub().rejects(new Error('Database error'));
            }),
          },
        },
      });
      sinon.stub(logger, 'error');

      const result = await command.deleteOne({});
      assert.notEqual(result.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });

    it('should wrapper data if success to deleteOne', async () => {
      stubDb.returns({
        collection: () => {
          return {
            deleteOne: sinon.stub().callsFake(() => {
              return Promise.resolve({ data: 'data' });
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const res = await command.deleteOne({});
      assert.equal(res.data.data, 'data');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
      stubDb.restore();
    });

    it('should wrapper data if failed to deleteOne', async () => {
      stubDb.returns({
        collection: () => {
          return {
            deleteOne: sinon.stub().callsFake(() => {
              return Promise.resolve({});
            }),
          };
        },
      });
      sinon.stub(logger, 'error');

      const res = await command.deleteOne({});
      assert.equal(res.err, 'Data not found');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
      stubDb.restore();
    });
  });

  describe('aggregate', () => {
    it('should wrapper error if get connection error', async () => {
      stubConn.resolves({
        err: {
          message: 'error'
        }
      });
      sinon.stub(logger, 'error');

      const res = await command.aggregate({});
      assert.equal(res.err.message, 'error');

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });
    it('should wrapper error if db function error', async () => {
      stubConn.resolves({
        err: null,
        data: {
          db: {
            db: sinon.stub().callsFake(() => sinon.stub().rejects(new Error('Error Db function')))
          }
        }
      });
      sinon.stub(logger, 'error');

      const res = await command.aggregate({});
      assert.notEqual(res.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });
    it('should wrapper data if findMany not success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            aggregate: sinon.stub().callsFake(() => {
              return {
                toArray: () => {
                  return Promise.resolve([]);
                }
              };
            })
          };
        }
      });
      sinon.stub(logger, 'error');

      const res = await command.aggregate({});
      assert.notEqual(res.err, null);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });
    it('should wrapper data if aggregate success', async () => {
      stubDb.returns({
        collection : () => {
          return {
            aggregate: sinon.stub().callsFake(() => {
              return {
                toArray: () => {
                  return Promise.resolve([{ 'ok': true }, { 'ok': false }]);
                }
              };
            })
          };
        }
      });
      sinon.stub(logger, 'error');

      const res = await command.aggregate({});
      assert.equal(res.data[0].ok, true);

      stubConn.restore();
      stubGetDb.restore();
      logger.error.restore();
    });
  });
});
