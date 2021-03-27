const winston = require('winston');

const logger = winston.createLogger({
  transports: [ new winston.transports.Console({
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  })
  ],
  exitOnError: false
});

const info = (context, message, scope) => {
  const obj = {
    context,
    scope,
    message: message.toString()
  };
  logger.info(obj);
};

const error = (context, message, error) => {
  const obj = {
    context,
    error,
    message: message.toString()
  };
  logger.error(obj);
};

module.exports = {
  info,
  error
};
