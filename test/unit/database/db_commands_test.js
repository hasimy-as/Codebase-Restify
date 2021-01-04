const sinon = require('sinon');
const assert = require('assert');

const logger = require('../../../app/lib/logger');
const mongoConnect = require('../../../app/database/db');
const db_commands = require('../../../app/database/db_commands');

describe('Unit database commands', () => {
	let stubDb;
	let stubConn;
	let stubGetDb;

	beforeEach(async () => {
		stubGetDb = sinon
			.stub(db_commands.prototype, 'getDatabase')
			.resolves('db');
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
			db_commands.prototype.getDatabase.restore();
			const mongo = new db_commands('mongodb://localhost:27017/test');
			mongo.setCollection('test');
			mongo.getDatabase();

			sinon.stub(logger, 'log');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
		});
	});

	describe('Db insertOne', () => {
		it('should wrapper error if get connection is error', async () => {
			stubConn.resolves({
				err: {
					message: 'error',
				},
			});
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.insertOne({});
			assert.equal(result.err.message, 'error');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.insertOne({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.insertOne({});
			assert.equal(result.err, 'Failed to insert data');

			stubConn.restore();
			stubGetDb.restore();
			stubDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			await db_commands.prototype.insertOne({});

			stubConn.restore();
			stubGetDb.restore();
			stubDb.restore();
			logger.log.restore();
		});
	});

	describe('Db findMany', () => {
		it('should wrapper error if get connection is error', async () => {
			stubConn.resolves({
				err: {
					message: 'error',
				},
			});
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findMany({});
			assert.equal(result.err.message, 'error');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findMany({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findMany({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			stubDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			await db_commands.prototype.findMany({});

			stubConn.restore();
			stubGetDb.restore();
			stubDb.restore();
			logger.log.restore();
		});
	});

	describe('Db findOne', () => {
		it('should wrapper error if get connection error', async () => {
			stubConn.resolves({
				err: {
					message: 'error',
				},
			});
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findOne({});
			assert.equal(result.err.message, 'error');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findOne({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.findOne({});
			assert.equal(result.data.success, true);

			stubConn.restore();
			stubGetDb.restore();
			stubDb.restore();
			logger.log.restore();
		});
	});

	describe('Db updateOne', () => {
		it('should wrapper error if get connection error', async () => {
			stubConn.resolves({
				err: {
					message: 'error',
				},
			});
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.updateOne({});
			assert.equal(result.err.message, 'error');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.updateOne({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
		});

		it('should wrapper data if success to insert updateOne', async () => {
			sinon.stub(db_commands.prototype, 'findOne').resolves({
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
			sinon.stub(logger, 'log');

			const res = await db_commands.prototype.updateOne({ data: 'data' });
			assert.equal(res.data, 'data');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
			stubDb.restore();
			db_commands.prototype.findOne.restore();
		});

		it('should wrapper data if success to updateOne', async () => {
			sinon.stub(db_commands.prototype, 'findOne').resolves({
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
			sinon.stub(logger, 'log');

			const res = await db_commands.prototype.updateOne({ data: 'data' });
			assert.equal(res.data, 'data');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
			stubDb.restore();
			db_commands.prototype.findOne.restore();
		});

		it('should wrapper data if failed to updateOne', async () => {
			sinon.stub(db_commands.prototype, 'findOne').resolves({
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
			sinon.stub(logger, 'log');

			const res = await db_commands.prototype.updateOne({ data: 'data' });
			assert.equal(res.err, 'Failed update data');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
			stubDb.restore();
			db_commands.prototype.findOne.restore();
		});
	});

	describe('Db deleteOne', () => {
		it('should wrapper error if get connection error', async () => {
			stubConn.resolves({
				err: {
					message: 'error',
				},
			});
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.deleteOne({});
			assert.equal(result.err.message, 'error');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const result = await db_commands.prototype.deleteOne({});
			assert.notEqual(result.err, null);

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const res = await db_commands.prototype.deleteOne({});
			assert.equal(res.data.data, 'data');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
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
			sinon.stub(logger, 'log');

			const res = await db_commands.prototype.deleteOne({});
			assert.equal(res.err, 'Data not found');

			stubConn.restore();
			stubGetDb.restore();
			logger.log.restore();
			stubDb.restore();
		});
	});
});
