const Application = require('./app/api/index');
const mongoConnect = require('./app/database/mongodb/connect');
const logger = require('./app/helpers/logger');
const config = require('./app/config/config');

const app = new Application();

app.server.listen(process.env.PORT || config.get('/port'), (err) => {
  mongoConnect.init();
  if (err) throw err;
  let ctx = 'App-listen';
  logger.info(ctx, 'Application running', 'Connected!');
});
