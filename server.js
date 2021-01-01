const Application = require('./app/api/index');
const mongoConnect = require('./app/database/db');
const logger = require('./app/lib/logger');
const env = require('./app/config/config');

const app = new Application();

app.server.listen(process.env.PORT || env.get('/port'), (err) => {
	mongoConnect.init();
	if (err) throw err;
	let ctx = 'app-listen';
	logger.log(ctx, 'application running', 'connected!');
});
