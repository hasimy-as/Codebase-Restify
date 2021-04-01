const winston = require('winston');

const logger = new winston.Logger({
  transports: [ new winston.transports.Console({
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  })
  ],
  exitOnError: false
});

const info = (context, message, scope) => logger.info({ context, scope, message: message.toString() });

const error = (context, message, error) => logger.error({ context, error, message: message.toString() });

module.exports = {
  info,
  error
};
