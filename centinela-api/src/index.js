const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const connect = () => mongoose.createConnection(config.mongoose.url, config.mongoose.options);

const connectToMongoDB = () => {
  const db = connect(config.mongoose.url);
  db.on('open', () => {
    logger.info(`Mongoose connection open to ${JSON.stringify(config.mongoose.url)}`);
    logger.info(`Retorna ${db}`);
    return db;
  });
  db.on('error', (err) => {
    logger.info(`Mongoose connection error: ${err} with connection info ${JSON.stringify(config.mongoose.url)}`);
    process.exit(0);
  });
};

const server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

exports.mongodb = connectToMongoDB();
