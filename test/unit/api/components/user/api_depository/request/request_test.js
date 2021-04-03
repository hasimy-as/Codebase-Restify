const sinon = require('sinon');

const db_commands = require('../../../../../../../app/database/db_commands');
const request = require('../../../../../../../app/api/components/user/api_depository/request/request');

describe('Unit user request', () => {
  describe('Create user', () => {
    it('should fail to create user', async () => {
      sinon
        .stub(db_commands.prototype, 'insertOne')
        .resolves({ err: true });
      await request.insertOne();
      db_commands.prototype.insertOne.restore();
    });

    it('should success to create user', async () => {
      sinon.stub(db_commands.prototype, 'insertOne').resolves();
      await request.insertOne();
      db_commands.prototype.insertOne.restore();
    });
  });

  describe('Update user by userId', () => {
    it('should fail to update user', async () => {
      sinon
        .stub(db_commands.prototype, 'updateOne')
        .resolves({ err: true });
      await request.updateOne();
      db_commands.prototype.updateOne.restore();
    });

    it('should success to update user', async () => {
      sinon.stub(db_commands.prototype, 'updateOne').resolves();
      await request.updateOne();
      db_commands.prototype.updateOne.restore();
    });
  });

  describe('Delete user by userId', () => {
    it('should fail to delete user', async () => {
      sinon
        .stub(db_commands.prototype, 'deleteOne')
        .resolves({ err: true });
      await request.deleteOne();
      db_commands.prototype.deleteOne.restore();
    });

    it('should success to delete user', async () => {
      sinon.stub(db_commands.prototype, 'deleteOne').resolves();
      await request.deleteOne();
      db_commands.prototype.deleteOne.restore();
    });
  });
});
