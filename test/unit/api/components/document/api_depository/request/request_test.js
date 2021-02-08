const sinon = require('sinon');

const db_commands = require('../../../../../../../app/database/db_commands');
const request = require('../../../../../../../app/api/components/document/api_depository/request/request');

describe('Unit document request', () => {
  describe('Create document', () => {
    it('should fail to create document', async () => {
      sinon
        .stub(db_commands.prototype, 'insertOne')
        .resolves({ err: true });
      await request.insertOne();
      db_commands.prototype.insertOne.restore();
    });

    it('should success to create document', async () => {
      sinon.stub(db_commands.prototype, 'insertOne').resolves();
      await request.insertOne();
      db_commands.prototype.insertOne.restore();
    });
  });

  describe('Update documentById', () => {
    it('should fail to update document', async () => {
      sinon
        .stub(db_commands.prototype, 'updateOne')
        .resolves({ err: true });
      await request.updateOne();
      db_commands.prototype.updateOne.restore();
    });

    it('should success to update document', async () => {
      sinon.stub(db_commands.prototype, 'updateOne').resolves();
      await request.updateOne();
      db_commands.prototype.updateOne.restore();
    });
  });

  describe('Delete documentById', () => {
    it('should fail to delete document', async () => {
      sinon
        .stub(db_commands.prototype, 'deleteOne')
        .resolves({ err: true });
      await request.deleteOne();
      db_commands.prototype.deleteOne.restore();
    });

    it('should success to delete document', async () => {
      sinon.stub(db_commands.prototype, 'deleteOne').resolves();
      await request.deleteOne();
      db_commands.prototype.deleteOne.restore();
    });
  });
});
