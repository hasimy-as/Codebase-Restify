const hippie = require('hippie');
const { CODE } = require('../../../../app/lib/http_code');
const Application = require('../../../../app/api/index');

describe('Integration main server', () => {
	beforeEach(function () {
		let app = new Application();
		this.server = app.server;
	});

	afterEach(function () {
		this.server.close();
	});
	it('should return success code in accessing root', function (done) {
		hippie(this.server).get('/').expectStatus(CODE.SUCCESS).end(done);
	});
});
