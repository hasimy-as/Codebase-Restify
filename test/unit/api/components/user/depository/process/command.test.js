const sinon = require('sinon');

const Command = require('../../../../../../../app/api/components/user/depository/process/command');

describe('User command', async () => {
  const db = {
    insertOne: sinon.stub().resolves(),
    updateOne: sinon.stub().resolves(),
    deleteOne: sinon.stub().resolves(),
    setCollection: sinon.stub().resolves(),
  };
  const process = new Command(db);

  it('should success process insertOne', async () => await process.insertOne({}));

  it('should success process updateOne', async () => await process.updateOne({}));

  it('should success process deleteOne', async () => await process.deleteOne({}));
});
