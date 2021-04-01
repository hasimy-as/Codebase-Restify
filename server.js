const Application = require('./app/api/index');
const mongoConnect = require('./app/database/mongodb/connect');
const logger = require('./app/helpers/logger');
const config = require('./app/config/config');

const app = new Application();

app.server.listen(process.env.PORT || config.get('/port'), (err) => {
  let ctx = 'App-listen';
  if (err) throw logger.error(ctx, err, 'Server');
  mongoConnect.init();
  logger.info(ctx, 'Connected!', 'Server');
});
