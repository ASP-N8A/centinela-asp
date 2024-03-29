const mongoose = require('mongoose');
const path = require('path');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { invitationEmailQueue, issueEmailQueue } = require('./queue');
const sendIssueProcessor = require('./queue/sendIssueProcessor');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  invitationEmailQueue.process(path.resolve(process.cwd(), 'src/queue', 'sendEmailProcessor.js'));
  issueEmailQueue.process(sendIssueProcessor);

  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
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
