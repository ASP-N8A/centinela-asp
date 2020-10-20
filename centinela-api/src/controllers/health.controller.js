const catchAsync = require('../utils/catchAsync');
const healthService = require('../services/health.service');
const logger = require('../config/logger');

const checkHealth = catchAsync(async (req, res) => {
  const dbHealth = await healthService.checkDbHealth();
  const redisHealth = await healthService.checkRedisHealth();

  if (dbHealth && redisHealth) {
    logger.info(`Health check succesful`);
    res.sendStatus(200);
  } else {
    if (!dbHealth) {
      logger.info(`Database health check succesful`);
      res.sendStatus(500);
    }
    if (!redisHealth) {
      logger.info(`Redis health check succesful`);
      res.sendStatus(500);
    }
  }
});

module.exports = {
  checkHealth,
};
