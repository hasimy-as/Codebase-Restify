const sinon = require('sinon');
const Query = require('../../../../../../../app/api/components/document/depository/inquiry/query');

describe('Document query', async () => {
  const db = {
    findOne: sinon.stub().resolves(),
    findMany: sinon.stub().resolves(),
    setCollection: sinon.stub().resolves(),
  };
  const qProcess = new Query(db);

  it('should success query process findMany', async () => await qProcess.findMany({}));

  it('should success query process findOne', async () => await qProcess.findOne({}));
});
